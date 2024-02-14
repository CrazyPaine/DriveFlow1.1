const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/process-image', (req, res) => {
    const imageDataURL = req.body.imageDataURL;

    if (!imageDataURL) {
        res.status(400).json({ success: false, message: 'No image data received.' });
        return;
    }
    
    /* Additional processing logic can be added here, such as saving the image */
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
