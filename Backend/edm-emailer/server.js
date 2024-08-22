const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Root URL route
app.get('/', (req, res) => {
  res.send('Email sending service is running!');
});

app.post('/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  let transporter = nodemailer.createTransport({
    host: 'smtp.example.com', 
    port: 587, 
    secure: false, 
    auth: {
      user: 'senujidimansa@gmail.com', 
      pass: 'ijvs bpez azjr qgaz', 
    },
  });

  try {
    let info = await transporter.sendMail({
      from: '"Your Name" senujidimansa@gmail.com',
      to: to,
      subject: subject,
      html: html,
    });

    console.log('Message sent: %s', info.messageId);
    res.status(200).send({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Error sending email.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
