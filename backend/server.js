import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import e from 'express';
import { createDecipheriv } from 'crypto';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://benchamMores:123@cluster0.evwrlqc.mongodb.net/benchamMores?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    location: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nimradhanethmini2002@gmail.com',        // Replace with your Gmail
    pass: 'xhxm swpk uohd samg',          // Use App Password if 2FA is on
  },
});


app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();

        const mailOptions = {
          from: '"Bencham Website" <nimradhanethmini2002@gmail.com>', // sender address
          to: 'fonseka.chamath@gmail.com', // list of receivers
          subject: 'New Contact Form Submission', // Subject line
          text: `You have a new contact form submission:\n\nName: ${req.body.name}\nEmail: ${req.body.email}\nPhone: ${req.body.phone}\nLocation: ${req.body.location}\nMessage: ${req.body.message}` // plain text body
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully!' });
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send message.' });
    }
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})