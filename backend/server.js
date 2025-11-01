import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import e from 'express';
import { createDecipheriv } from 'crypto';

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

app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(200).json({ message: 'Message sent successfully!' });
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send message.' });
    }
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})