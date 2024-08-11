const video = document.getElementById('video');
let labeledFaceDescriptors = [];
let modelsLoaded = false;

// Load face-api.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(() => {
  modelsLoaded = true;
  console.log('Models loaded successfully');
  startVideo();
}).catch(err => {
  console.error('Error loading models:', err);
});

// Start video stream
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      video.srcObject = stream;
      console.log('Video stream started');
    })
    .catch(err => console.error('Error accessing webcam:', err));
}

// Capture face and save descriptor for registration
async function captureFace() {
  if (!modelsLoaded) {
    alert("Models are still loading. Please wait.");
    return;
  }

  const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  console.log('Detections:', detections);

  if (detections) {
    const descriptor = detections.descriptor;
    const label = prompt("Enter name for the captured face:");
    labeledFaceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, [descriptor]));

    // Save data to backend
    fetch('http://localhost:5501/save-descriptors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(labeledFaceDescriptors.map(lfd => ({
        label: lfd.label,
        descriptors: lfd.descriptors.map(d => Array.from(d))
      })))
    }).then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));

    alert('Registered Successfully');
  } else {
    alert("No face detected. Please try again.");
  }
}

// Capture face and send descriptor for login
async function loginFace() {
  if (!modelsLoaded) {
    alert("Models are still loading. Please wait.");
    return;
  }

  const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  console.log('Detections:', detections);

  if (detections) {
    const descriptor = detections.descriptor;

    // Send descriptor to backend for authentication
    fetch('http://localhost:5501/verify-descriptor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ descriptor: Array.from(descriptor) })
    }).then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Login Successful');
          // Redirect or perform any other action on successful login
        } else {
          alert('Login Failed. Face not recognized.');
        }
      })
      .catch(error => console.error('Error:', error));
  } else {
    alert("No face detected. Please try again.");
  }
}

// Attach the login function to the login button
document.getElementById('Login').addEventListener('click', loginFace);

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    if (!modelsLoaded) return;
    
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    if (labeledFaceDescriptors.length > 0) {
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
      const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
        drawBox.draw(canvas);
      });
    }
  }, 100);
});

document.getElementById('register').addEventListener('click', captureFace);
