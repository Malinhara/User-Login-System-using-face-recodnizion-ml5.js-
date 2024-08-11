const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const { distanceBetweenLandmarks } = require('./util');
const THRESHOLD = 50; // Example value

app.use(express.static('Public'));
app.set('views', './Views');
app.set('view engine', 'ejs');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // change to your MySQL username
  password: '', // change to your MySQL password
  database: 'faceApp'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

app.get('/register', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('Login');
});

app.get('/dashboard', (req, res) => {
  res.render('Dashboard');
});

app.post('/registerFace', (req, res) => {
  const landmarks = req.body.landmarks;
  const label = req.body.label; // Assuming each set of landmarks has an associated label

  if (!landmarks || !Array.isArray(landmarks)) {
    return res.status(400).json({ error: 'Invalid face data' });
  }

  // Prepare SQL query and values
  const sql = 'INSERT INTO face_descriptors (label, descriptor) VALUES (?, ?)';
  const values = [label, JSON.stringify(landmarks)];

  // Execute SQL query
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json({ message: 'Face data registered successfully', id: results.insertId });
  });
});

app.post('/loginFace', (req, res) => {
  const { landmarks } = req.body;

  if (!landmarks || !Array.isArray(landmarks)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  console.log('Received landmarks:', landmarks);

  db.query('SELECT label, descriptor FROM face_descriptors', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    let isMatch = false;
    for (const row of results) {
      const registeredLandmarks = JSON.parse(row.descriptor);

      console.log('Comparing with registered landmarks:', registeredLandmarks);

      const distance = distanceBetweenLandmarks(landmarks, registeredLandmarks);
      console.log('Distance calculated:', distance);

      if (distance < THRESHOLD) {
        isMatch = true;
        break;
      }
    }

    res.status(200).json({ success: isMatch });
  });
});

app.listen(5501, () => {
  console.log('Server running on port 5501');
});
