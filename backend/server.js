import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import e from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import https from 'https';


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

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  addressLine: { type: String, required: true },
  label: { type: String, enum: ["home", "office"], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Address = mongoose.model("Address", addressSchema);

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      title: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine: String,
    city: String,
    district: String,
    province: String,
    label: String
  },
  paymentMethod: String,
  cardLast4: String,
  subtotal: Number,
  tax: Number,
  totalAmount: Number,
  status: { type: String, default: "Paid" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);




const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // expecting "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // Use a strong secret
    req.user = { id: decoded.id }; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};



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

// Google OAuth login — exchanges Google access_token for an app JWT
app.post("/api/google-login", async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ message: "Access token is required" });
    }

    // Fetch the user's Google profile using Node's built-in https module
    const profile = await new Promise((resolve, reject) => {
      https.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
        (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Google API returned status ${response.statusCode}`));
            return;
          }
          let data = '';
          response.on('data', (chunk) => { data += chunk; });
          response.on('end', () => {
            try { resolve(JSON.parse(data)); }
            catch (e) { reject(new Error('Failed to parse Google response')); }
          });
        }
      ).on('error', reject);
    });

    const { email, name } = profile;
    if (!email) {
      return res.status(400).json({ message: "Could not retrieve email from Google" });
    }

    // Find or create the user in MongoDB
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, password: "" }); // no password for Google users
      await user.save();
    }

    // Issue an app JWT
    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "7d" });
    res.json({ token, name: user.name, email: user.email });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "7d",
    });

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    const token = jwt.sign({ id: newUser._id }, "your_jwt_secret", { expiresIn: "7d" });
    res.status(201).json({ message: "Account created successfully" , token});

  

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/address", authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, province, district, city, addressLine, label } = req.body;

    if (!fullName || !phone || !province || !district || !city || !addressLine || !label) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAddress = new Address({
      userId: req.user.id,
      fullName,
      phone,
      province,
      district,
      city,
      addressLine,
      label
    });

    await newAddress.save();
    res.status(201).json(newAddress);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all addresses of the logged-in user
app.get("/api/address", authMiddleware, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Update an address
app.put("/api/address/:id", authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, province, district, city, addressLine, label } = req.body;
    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { fullName, phone, province, district, city, addressLine, label },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Address not found" });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new order
app.post("/api/orders", authMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, cardNumber, subtotal, tax, totalAmount, status } = req.body;

    const cardLast4 = cardNumber ? cardNumber.slice(-4) : "";

    const newOrder = new Order({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      cardLast4,
      subtotal,
      tax,
      totalAmount,
      status: status || "Paid"
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// Get user orders
app.get("/api/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PayHere Configuration (Sandbox User Credentials)
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || "1235278";
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || "MTU0NTEwMjc4NjI4NDk2MzMyOTQxNDIyOTQwMTUzODk0MzIyMjAw";

function generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret) {
  const formattedAmount = Number(amount).toFixed(2);
  const secretHash = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
  const hashString = merchantId + orderId + formattedAmount + currency + secretHash;
  return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
}

// Endpoint to generate PayHere payment parameters & MD5 security hash
app.post("/api/payhere/generate-hash", authMiddleware, async (req, res) => {
  try {
    const { amount, currency = "LKR", items, shippingAddress } = req.body;
    const orderId = "BENCHAM-" + Date.now();

    const hash = generatePayHereHash(
      PAYHERE_MERCHANT_ID,
      orderId,
      amount,
      currency,
      PAYHERE_MERCHANT_SECRET
    );

    const user = await User.findById(req.user.id);

    res.json({
      sandbox: true,
      merchant_id: PAYHERE_MERCHANT_ID,
      return_url: "http://localhost:3000/order-success",
      cancel_url: "http://localhost:3000/buy",
      notify_url: "http://localhost:3000/api/payhere/notify",
      order_id: orderId,
      items: items && items.length > 0 ? items.map(i => i.title).join(", ") : "Bencham Gemstone Purchase",
      amount: Number(amount).toFixed(2),
      currency: currency,
      hash: hash,
      first_name: shippingAddress?.fullName || user?.name || "Customer",
      last_name: "Customer",
      email: user?.email || "customer@example.com",
      phone: shippingAddress?.phone || "0771234567",
      address: shippingAddress?.addressLine || "Street Address",
      city: shippingAddress?.city || "Colombo",
      country: "Sri Lanka",
      delivery_address: shippingAddress?.addressLine || "Street Address",
      delivery_city: shippingAddress?.city || "Colombo",
      delivery_country: "Sri Lanka",
      custom_1: user?.email || "",
      custom_2: ""
    });
  } catch (error) {
    console.error("PayHere Hash Error:", error);
    res.status(500).json({ message: "Failed to generate PayHere security token" });
  }
});

// PayHere Server-to-Server Webhook Notification Endpoint
app.post("/api/payhere/notify", async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      custom_1,
      custom_2
    } = req.body;

    const secretHash = crypto.createHash('md5').update(PAYHERE_MERCHANT_SECRET).digest('hex').toUpperCase();
    const localHashString = merchant_id + order_id + payhere_amount + payhere_currency + status_code + secretHash;
    const expectedHash = crypto.createHash('md5').update(localHashString).digest('hex').toUpperCase();

    // Verify MD5 signature authenticity
    if (expectedHash !== md5sig) {
      console.warn("PayHere Webhook MD5 Mismatch!");
      return res.status(400).send("Signature verification failed");
    }

    // status_code 2 indicates success in PayHere
    if (status_code === "2") {
      console.log(`✅ PayHere Payment Success! Order: ${order_id}, Payment ID: ${payment_id}`);

      // Update or create Order status to Paid
      await Order.findOneAndUpdate(
        { orderId: order_id },
        { status: "Paid", paymentId: payment_id },
        { upsert: true, new: true }
      );

      // Send Email Receipt using Nodemailer if email available
      if (custom_1) {
        const mailOptions = {
          from: '"Bencham Gemstones" <nimradhanethmini2002@gmail.com>',
          to: custom_1,
          subject: `Order Confirmation - #${order_id}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #ad9551;">Thank You for Your Order!</h2>
              <p>Your payment of <strong>LKR ${payhere_amount}</strong> has been received successfully.</p>
              <p><strong>Order ID:</strong> ${order_id}</p>
              <p><strong>Payment ID:</strong> ${payment_id}</p>
              <hr />
              <p>We are preparing your certified gemstone item for delivery.</p>
            </div>
          `
        };
        transporter.sendMail(mailOptions).catch(err => console.error("Email send error:", err));
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("PayHere notify error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
