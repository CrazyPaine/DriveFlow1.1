$(document).ready(function () {
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

            $('#captureBtn').on('click', function () {
                captureImage();
            });

            $('#uploadInput').on('change', function (event) {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageDataURL = e.target.result;
                    processImage(imageDataURL);
                };
                reader.readAsDataURL(file);
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
                    { logger: m => console.log(m) }
                ).then(({ data: { text } }) => {
                    displayResult(text);
                }).catch(error => {
                    console.error('Error processing the image:', error);
                    displayResult('An error occurred while processing the image.');
                });
            }

            function displayResult(message) {
                resultDiv.html(`<p>${message}</p>`);
            }
        })