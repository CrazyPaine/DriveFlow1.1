$(document).ready(function() {
    // Get references to DOM elements
    const video = $('#video')[0]; // Video element
    const canvas = $('#canvas')[0]; // Canvas element for image manipulation
    const resultDiv = $('#result'); // Div to display result
    const constraints = { video: true }; // Constraints for accessing webcam

    // Access user's webcam
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream; // Set video stream as source for video element
        })
        .catch((err) => {
            console.error('Error accessing webcam:', err);
            displayResult('Failed to access webcam. Please check your permissions.'); // Display error message
        });

    // Event listener for capture button click
    $('#captureBtn').on('click', function() {
        captureImage(); // Call captureImage function when capture button is clicked
    });

    // Function to capture image from video stream
    function captureImage() {
        // Set canvas dimensions to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Draw video frame onto canvas
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas image to data URL (base64 encoded PNG)
        const imageDataURL = canvas.toDataURL('image/png');
        processImage(imageDataURL); // Call processImage function with captured image data
    }

    // Function to process captured image
    function processImage(imageDataURL) {
        // Send image data to server for further processing
        fetch('http://localhost:3000/process-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set request header
            },
            body: JSON.stringify({ imageDataURL }), // Send image data as JSON in request body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to process image. Server returned ' + response.status); // Throw error if response is not OK
            }
            return response.json();
        })
        .then(data => {
            // Handle response from server
            if (data.success) {
                displayResult('Successfully processed the image.'); // Display success message
            } else {
                displayResult('Failed to process the image.'); // Display failure message
            }
        })
        .catch(error => {
            console.error('Error processing the image:', error); // Log error if request fails
            displayResult('An error occurred while processing the image.'); // Display error message
        });
    }

    // Function to display result message
    function displayResult(message) {
        resultDiv.html(`<p>${message}</p>`); // Display message in result div
    }
});
