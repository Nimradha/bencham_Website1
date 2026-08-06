import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import e from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://benchamMores:123@cluster0.96s9z9n.mongodb.net/?appName=Cluster0';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

mongoose.connect(MONGO_URI)
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
  cancelledAt: { type: Date },
  returnReason: { type: String },
  returnRequestedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productTitle: { type: String },
  productImage: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userName: { type: String },
  userEmail: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);




const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // expecting "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id }; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};



// ── Email Transporter (Brevo SMTP) ───────────────────────────────────────────
const BREVO_SMTP_LOGIN = process.env.BREVO_SMTP_LOGIN || 'b37923001@smtp-brevo.com';
const BREVO_SMTP_KEY   = process.env.BREVO_SMTP_KEY   || 'xsmtpsib-c502ec3a700482a107197047774e55391f98e3c8e581fbd80390c87889eddd23-K8PJM4DmZhwDS9LT';
const STORE_EMAIL      = process.env.STORE_EMAIL      || 'nimradhanethmini2002@gmail.com';
const OWNER_EMAIL      = process.env.OWNER_EMAIL      || 'fonseka.chamath@gmail.com';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: BREVO_SMTP_LOGIN,
    pass: BREVO_SMTP_KEY,
  },
});



app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();

        // Extract user email from JWT token if provided
        let userEmail = req.body.email || '';
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
                if (decoded.email) userEmail = decoded.email;
            } catch (e) { /* use form email as fallback */ }
        }

        const mailOptions = {
          from: `"Bencham Website" <${STORE_EMAIL}>`,
          to: OWNER_EMAIL,
          replyTo: userEmail || undefined,   // ← clicking Reply goes to the customer
          subject: `New Message from ${req.body.name} (${userEmail})`,
          text: `You have a new contact form submission.\n\nFrom: ${req.body.name}\nEmail: ${userEmail}\nPhone: ${req.body.phone}\nLocation: ${req.body.location}\n\nMessage:\n${req.body.message}\n\n──────────────────────────\nReply directly to this email to respond to the customer.`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (err) {
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

    // Fetch the user's Google profile
    const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    if (!googleRes.ok) {
      const errBody = await googleRes.text();
      console.error("Google userinfo error response:", errBody);
      return res.status(400).json({ message: "Failed to verify token with Google: " + errBody });
    }

    const profile = await googleRes.json();
    const { email, name } = profile;
    if (!email) {
      return res.status(400).json({ message: "Could not retrieve email from Google" });
    }

    // Find or create the user in MongoDB
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name: name || email.split('@')[0], email, password: "" });
      await user.save();
    }

    // Issue an app JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, name: user.name, email: user.email });

  } catch (error) {
    console.error("Google login server error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
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

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



// Token validation endpoint — used by frontend to check if stored session is still valid
app.get('/api/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ id: decoded.id, email: decoded.email });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
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
       from: `"Bencham Website" <${STORE_EMAIL}>`,
       to: email,
       subject: "Password Reset Request",
       text: `Hi ${user.name},\n\nUse this token to reset your password: ${resetToken}\n\nIf you didn't request a password reset, ignore this email.`,
     };

     await transporter.sendMail(mailOptions);
     console.log(`Password reset token for ${email}: ${resetToken}`);

     res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1. Validation
    if (!firstName || !lastName || !email || !password) {
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
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "Account created successfully" , token});
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

// Helper to send order confirmation email via Nodemailer
const sendOrderConfirmationEmail = async (order, recipientEmail) => {
  if (!recipientEmail) return;

  const isCOD = order.status && (order.status.includes("Pending") || order.status.includes("COD"));
  const orderIdFormatted = order._id ? order._id.toString().slice(-8).toUpperCase() : "ORD-NEW";

  const subject = isCOD
    ? `Order Received: Bencham Jewellers #${orderIdFormatted}`
    : `Order Confirmation: Bencham Jewellers #${orderIdFormatted}`;

  const statusBanner = isCOD
    ? `Your Cash on Delivery order #${orderIdFormatted} has been received and is awaiting dispatch.`
    : `Thank you for your payment! Your order #${orderIdFormatted} has been confirmed and is being prepared for dispatch.`;

  const statusBadgeColor = isCOD ? "#f39c12" : "#28a745";
  const statusBadgeText = isCOD ? "Pending (Cash on Delivery)" : "Paid (Online Gateway)";

  const itemsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.title}</strong>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        LKR ${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const addressHtml = order.shippingAddress
    ? `${order.shippingAddress.fullName}<br/>
       ${order.shippingAddress.addressLine}<br/>
       ${order.shippingAddress.city}, ${order.shippingAddress.district}, ${order.shippingAddress.province}<br/>
       Phone: ${order.shippingAddress.phone}`
    : "No shipping address provided";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background-color: #27001a; color: #d4be82; text-align: center; padding: 25px 20px;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">BENCHAM JEWELLERS</h1>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #ffffff; opacity: 0.8;">Where Elegance Meets Sparkle</p>
        </div>

        <div style="padding: 25px;">
          <h2 style="color: #27001a; font-size: 18px; margin-top: 0;">Order Status Update</h2>
          <p style="font-size: 15px; line-height: 1.5; color: #444;">
            ${statusBanner}
          </p>

          <div style="margin: 20px 0; padding: 12px 15px; background: #fdfaf3; border-left: 4px solid ${statusBadgeColor};">
            <strong>Payment Status:</strong> <span style="color: ${statusBadgeColor}; font-weight: bold;">${statusBadgeText}</span>
          </div>

          <h3 style="border-bottom: 2px solid #27001a; padding-bottom: 5px; color: #27001a; font-size: 16px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; border-top: 2px solid #eee; padding-top: 10px; font-size: 16px;">
            <strong>Total Amount:</strong>
            <strong style="color: #27001a;">LKR ${Number(order.totalAmount || 0).toFixed(2)}</strong>
          </div>

          <h3 style="border-bottom: 2px solid #27001a; padding-bottom: 5px; color: #27001a; font-size: 16px; margin-top: 25px;">Shipping Address</h3>
          <p style="font-size: 14px; line-height: 1.5; color: #555;">
            ${addressHtml}
          </p>

          ${isCOD ? `
            <div style="margin-top: 20px; padding: 12px; background: #fff3cd; color: #856404; border-radius: 4px; font-size: 13px;">
              📌 <strong>COD Note:</strong> Please prepare exact cash (LKR ${Number(order.totalAmount || 0).toFixed(2)}) upon delivery.
            </div>
          ` : ''}

          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 15px;">
            Thank you for shopping with Bencham Jewellers.<br/>
            If you have any questions, feel free to contact us at support@benchamjewellers.com
          </div>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: '"Bencham Jewellers" <nimradhanethmini2002@gmail.com>',
    to: recipientEmail,
    bcc: STORE_EMAIL,
    subject: subject,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${recipientEmail}`);
  } catch (err) {
    console.error("Order email error:", err);
  }
};

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

    // Fetch user email to send receipt email
    try {
      let recipientEmail = req.user?.email;
      if (!recipientEmail && req.user?.id) {
        const user = await User.findById(req.user.id);
        recipientEmail = user?.email;
      }
      console.log(`Sending order confirmation email directly to customer (${recipientEmail})...`);
      if (recipientEmail) {
        sendOrderConfirmationEmail(newOrder, recipientEmail);
      }
    } catch (e) {
      console.error("Email fetch error:", e);
    }

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

// ── Mark order as Delivered ──────────────────────────────────────────────────
app.patch("/api/orders/:id/deliver", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Delivered";
    await order.save();

    res.json({ message: "Order status updated to Delivered", order });
  } catch (error) {
    console.error("Mark deliver error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ── Cancel an order ──────────────────────────────────────────────────────────
app.patch("/api/orders/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const cancellableStatuses = ["Pending (COD)", "Paid"];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel an order with status: ${order.status}` });
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();
    await order.save();

    // Send cancellation email
    try {
      let recipientEmail = req.user?.email;
      if (!recipientEmail) {
        const user = await User.findById(req.user.id);
        recipientEmail = user?.email;
      }
      if (recipientEmail) sendCancellationEmail(order, recipientEmail);
    } catch (e) {
      console.error("Cancellation email error:", e);
    }

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ── Request a return ─────────────────────────────────────────────────────────
app.patch("/api/orders/:id/return", authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Delivered") {
      return res.status(400).json({ message: "Returns can only be requested for delivered orders." });
    }

    order.status = "Return Requested";
    order.returnReason = reason || "No reason provided";
    order.returnRequestedAt = new Date();
    await order.save();

    // Send return request email
    try {
      let recipientEmail = req.user?.email;
      if (!recipientEmail) {
        const user = await User.findById(req.user.id);
        recipientEmail = user?.email;
      }
      if (recipientEmail) sendReturnRequestEmail(order, recipientEmail);
    } catch (e) {
      console.error("Return email error:", e);
    }

    res.json({ message: "Return request submitted successfully", order });
  } catch (error) {
    console.error("Return order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ── REVIEWS API ─────────────────────────────────────────────────────────────

// Post a review
app.post("/api/reviews", authMiddleware, async (req, res) => {
  try {
    const { productId, productTitle, productImage, orderId, rating, comment } = req.body;

    if (!productId || !orderId || !rating || !comment) {
      return res.status(400).json({ message: "Missing required review fields" });
    }

    // Check if already reviewed for this order & product
    const existing = await Review.findOne({ userId: req.user.id, orderId, productId });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this item for this order." });
    }

    const user = await User.findById(req.user.id);
    const userName = user?.name || (user?.email ? user.email.split("@")[0] : "Customer");

    const newReview = new Review({
      productId,
      productTitle: productTitle || "Gemstone Item",
      productImage: productImage || "",
      userId: req.user.id,
      orderId,
      userName,
      userEmail: user?.email || "",
      rating: Number(rating),
      comment: comment.trim()
    });

    await newReview.save();
    res.status(201).json({ message: "Review submitted successfully!", review: newReview });
  } catch (error) {
    console.error("Post review error:", error);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

// Get reviews for a specific product + average rating & breakdown
app.get("/api/reviews/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    let averageRating = 0;
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (totalReviews > 0) {
      const sum = reviews.reduce((acc, r) => {
        const star = Math.min(5, Math.max(1, Math.round(r.rating)));
        starCounts[star] = (starCounts[star] || 0) + 1;
        return acc + r.rating;
      }, 0);
      averageRating = Number((sum / totalReviews).toFixed(1));
    }

    res.json({
      reviews,
      stats: {
        totalReviews,
        averageRating,
        starCounts
      }
    });
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's submitted reviews
app.get("/api/reviews/user", authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get set of orderId+productId reviewed by current user (for filtering To Review queue)
app.get("/api/reviews/user/submitted", authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).select("orderId productId");
    const reviewedKeys = reviews.map(r => `${r.orderId}_${r.productId}`);
    res.json(reviewedKeys);
  } catch (error) {
    console.error("Get user submitted review keys error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ── Cancellation Email ────────────────────────────────────────────────────────
const sendCancellationEmail = async (order, recipientEmail) => {
  const isCOD = order.paymentMethod?.includes("COD") || order.paymentMethod?.includes("Cash");
  const shortId = order._id.toString().slice(-8).toUpperCase();
  const itemsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${item.title}</strong></td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">LKR ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`).join("");

  const refundNote = isCOD
    ? `<p style="color:#555;font-size:14px;">Since this was a <strong>Cash on Delivery</strong> order, no payment was collected so no refund is needed.</p>`
    : `<div style="margin:15px 0;padding:12px;background:#fff3cd;border-left:4px solid #f39c12;font-size:13px;color:#856404;">
        💳 <strong>Refund Notice:</strong> Since you paid online, your refund of <strong>LKR ${Number(order.totalAmount).toFixed(2)}</strong> will be processed within <strong>5–10 business days</strong> to your original payment method.
       </div>`;

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f7f7f7;padding:20px;color:#333;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
        <div style="background:#27001a;color:#d4be82;text-align:center;padding:25px 20px;">
          <h1 style="margin:0;font-size:24px;letter-spacing:1px;">BENCHAM JEWELLERS</h1>
          <p style="margin:5px 0 0;font-size:12px;color:#fff;opacity:0.8;">Where Elegance Meets Sparkle</p>
        </div>
        <div style="padding:25px;">
          <h2 style="color:#c0392b;font-size:18px;margin-top:0;">🚫 Order Cancelled</h2>
          <p style="font-size:15px;line-height:1.5;color:#444;">
            Your order <strong>#${shortId}</strong> has been successfully cancelled on ${new Date(order.cancelledAt).toLocaleDateString()}.
          </p>
          ${refundNote}
          <h3 style="border-bottom:2px solid #27001a;padding-bottom:5px;color:#27001a;font-size:16px;">Cancelled Order Summary</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead><tr style="background:#f2f2f2;">
              <th style="padding:8px;text-align:left;">Item</th>
              <th style="padding:8px;text-align:center;">Qty</th>
              <th style="padding:8px;text-align:right;">Price</th>
            </tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="display:flex;justify-content:space-between;border-top:2px solid #eee;padding-top:10px;font-size:16px;margin-top:10px;">
            <strong>Order Total:</strong>
            <strong style="color:#27001a;">LKR ${Number(order.totalAmount).toFixed(2)}</strong>
          </div>
          <div style="margin-top:30px;text-align:center;font-size:12px;color:#888;border-top:1px solid #eee;padding-top:15px;">
            Thank you for shopping with Bencham Jewellers.<br/>
            If you have any questions, contact us at support@benchamjewellers.com
          </div>
        </div>
      </div>
    </div>`;

  await transporter.sendMail({
    from: `"Bencham Jewellers" <${STORE_EMAIL}>`,
    to: recipientEmail,
    bcc: STORE_EMAIL,
    subject: `Order Cancelled: Bencham Jewellers #${shortId}`,
    html
  });
  console.log(`Cancellation email sent to ${recipientEmail}`);
};

// ── Return Request Email ───────────────────────────────────────────────────────
const sendReturnRequestEmail = async (order, recipientEmail) => {
  const shortId = order._id.toString().slice(-8).toUpperCase();
  const html = `
    <div style="font-family:Arial,sans-serif;background:#f7f7f7;padding:20px;color:#333;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
        <div style="background:#27001a;color:#d4be82;text-align:center;padding:25px 20px;">
          <h1 style="margin:0;font-size:24px;letter-spacing:1px;">BENCHAM JEWELLERS</h1>
          <p style="margin:5px 0 0;font-size:12px;color:#fff;opacity:0.8;">Where Elegance Meets Sparkle</p>
        </div>
        <div style="padding:25px;">
          <h2 style="color:#8e44ad;font-size:18px;margin-top:0;">↩️ Return Request Received</h2>
          <p style="font-size:15px;line-height:1.5;color:#444;">
            We have received your return request for order <strong>#${shortId}</strong> placed on ${new Date(order.createdAt).toLocaleDateString()}.
          </p>
          <div style="margin:15px 0;padding:12px;background:#f3e5ff;border-left:4px solid #8e44ad;font-size:13px;color:#6c3483;">
            📋 <strong>Return Reason:</strong> ${order.returnReason}
          </div>
          <div style="margin:15px 0;padding:12px;background:#d5f5e3;border-left:4px solid #27ae60;font-size:13px;color:#1e8449;">
            ✅ Our team will contact you within <strong>2–3 business days</strong> with return instructions and collection arrangements.
          </div>
          <div style="margin-top:30px;text-align:center;font-size:12px;color:#888;border-top:1px solid #eee;padding-top:15px;">
            Thank you for shopping with Bencham Jewellers.<br/>
            If you have any questions, contact us at support@benchamjewellers.com
          </div>
        </div>
      </div>
    </div>`;

  await transporter.sendMail({
    from: `"Bencham Jewellers" <${STORE_EMAIL}>`,
    to: recipientEmail,
    bcc: STORE_EMAIL,
    subject: `Return Request Received: Bencham Jewellers #${shortId}`,
    html
  });
  console.log(`Return request email sent to ${recipientEmail}`);
};

// PayHere Configuration (Sandbox User Credentials)
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || "1235278";
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || "MTU0NTEwMjc4NjI4NDk2MzMyOTQxNDIyOTQwMTUzODk0MzIyMjAw";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

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
      return_url: `${CLIENT_URL}/order-success`,
      cancel_url: `${CLIENT_URL}/buy`,
      notify_url: `${BACKEND_URL}/api/payhere/notify`,
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
          from: `"Bencham Gemstones" <${STORE_EMAIL}>`,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
