// $(document).ready function to ensure DOM is fully loaded before executing scripts
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
        .catch((err) => console.error('Error accessing webcam:', err)); // Handle errors accessing webcam

    // Event listener for capture button click
    $('#captureBtn').click(function() {
        captureImage(); // Call captureImage function
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
        .then(response => response.json()) // Parse response as JSON
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
        });
    }

    // Function to display OCR result
    function displayResult(text) {
        // Display extracted information from OCR result
        resultDiv.html(`<h2>Driver's License Information:</h2>
                       <p>Name: [extracted name]</p>
                       <p>Address: [extracted address]</p>
                       <p>DL Expiration Date: [extracted expiration date]</p>`);
    }

    // Function to parse extracted text
    function parseData(text) {
        // Logic to parse extracted text and extract relevant information
        // For demonstration purposes only
        const data = {};
        const lines = text.split('\n'); // Split text into lines
        lines.forEach(line => {
            const [key, value] = line.split(': '); // Split line into key-value pair
            if (key && value) {
                data[key.toLowerCase()] = value.trim(); // Store key-value pair in data object
            }
        });
        return data; // Return parsed data
    }

});
