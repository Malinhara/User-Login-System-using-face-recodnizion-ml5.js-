// util.js

// Function to calculate Euclidean distance between two sets of landmarks
function distanceBetweenLandmarks(landmarks1, landmarks2) {
    if (landmarks1.length !== landmarks2.length) {
      throw new Error('Landmarks arrays must be of the same length');
    }
  
    let totalDistance = 0;
    let count = 0;
  
    for (let i = 0; i < landmarks1.length; i++) {
      const point1 = landmarks1[i];
      const point2 = landmarks2[i];
      const dx = point1.x - point2.x;
      const dy = point1.y - point2.y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
      count++;
    }
  
    return totalDistance / count; // Average distance
  }
  
  module.exports = { distanceBetweenLandmarks };
  