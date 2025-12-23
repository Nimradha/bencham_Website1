import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import e from 'express';
import { createDecipheriv } from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://benchamMores:123@cluster0.96s9z9n.mongodb.net/?appName=Cluster0')
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

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    resetToken: String,
    resetTokenExpiry: Date,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nimradhanethmini2002@gmail.com',        
    pass: 'xhxm swpk uohd samg',          
  },
  logger: true,
  debug: true,
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


app.post('/api/forgot-password', async (req, res) => {              
  try {                                                             
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

     const resetToken = Math.random().toString(36).substr(2); // simple token generation

      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 10*60*1000; // 10 min expiry
      await user.save();

     const mailOptions = {
       from: '"Bencham Website" <nimradhanethmini2002@gmail.com>',
       to: 'nimradhanethmini2002@gmail.com',
       subject: "Password Reset Request",
       text: `Hi ${user.name},\n\nUse this token to reset your password: ${resetToken}\n\nOr click this link: http://localhost:3001/reset-password?token=${resetToken}\n\nIf you didn't request a password reset, ignore this email.`,
     };

     await transporter.sendMail(mailOptions);
     console.log(`Password reset token for ${email}: ${resetToken}`);

     //await transporter.sendMail(mailOptions);
     res.status(200).json({ message: 'OTP sent successfully' });
     //try {
        //let info = await transporter.sendMail(mailOptions);
        //console.log("Email sent: ", info.response);
     
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process request.' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, resetToken: otp, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.resetToken !== otp || user.resetTokenExpiry < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  res.status(200).json({ message: 'OTP verified' });
});

app.post('/api/reset-password', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();
  res.status(200).json({ message: 'Password reset successful' });
});

app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, email, country, password } = req.body;

    // 1. Validate
    if (!firstName || !lastName || !email || !country || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save user
    const newUser = new User({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Account created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});