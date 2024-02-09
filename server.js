// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/process-image', (req, res) => {
    const imageDataURL = req.body.imageDataURL;
    // Call a function to process the image data further if needed
    // For example, you may want to save the image on the server or perform additional validation.
    res.json({ success: true });
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
