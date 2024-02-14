$(document).ready(function() {
    const video = $('#video')[0];
    const canvas = $('#canvas')[0];
    const resultDiv = $('#result');

    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error('Error accessing webcam:', err);
            displayResult('Failed to access webcam. Please check your permissions.');
        });

    $('#captureBtn').on('click', function() {
        captureImage();
    });

    function captureImage() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataURL = canvas.toDataURL('image/png');
        processImage(imageDataURL);
    }

    function processImage(imageDataURL) {
        fetch('http://localhost:3000/process-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageDataURL }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to process image. Server returned ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                displayResult('Successfully processed the image.');
            } else {
                displayResult('Failed to process the image.');
            }
        })
        .catch(error => {
            console.error('Error processing the image:', error);
            displayResult('An error occurred while processing the image.');
        });
    }

    function displayResult(message) {
        resultDiv.html(`<p>${message}</p>`);
    }
});
