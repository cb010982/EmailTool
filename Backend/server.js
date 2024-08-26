const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send-test-email', (req, res) => {
    const htmlContent = req.body.htmlContent; // Get HTML content from the request

    exec(`python send_emails.py "${htmlContent.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send({ status: 'error', message: 'Failed to send email.', error: error.message });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send({ status: 'error', message: 'Failed to send email.', error: stderr });
        }
        console.log(`stdout: ${stdout}`);
        return res.status(200).send({ status: 'success', message: 'Email sent successfully!' });
    });
});

