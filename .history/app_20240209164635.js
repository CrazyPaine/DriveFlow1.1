$(document).ready(function() {
    const video = $('#video')[0];
    const canvas = $('#canvas')[0];
    const resultDiv = $('#result');
    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => console.error('Error accessing webcam:', err));

    $('#captureBtn').click(function() {
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
        Tesseract.recognize(
            imageDataURL,
            'eng',
            { logger: info => console.log(info) }
        ).then(({ data: { text } }) => {
            displayResult(text);
        });
    }

    function displayResult(text) {
        // Extract and display relevant information from the OCR result
        // You'll need to implement logic to extract the name, address, and DL expiration date from the text.
        resultDiv.html(`<h2>Driver's License Information:</h2>
                       <p>Name: [extracted name]</p>
                       <p>Address: [extracted address]</p>
                       <p>DL Expiration Date: [extracted expiration date]</p>`);
    }
});