# 💎 Bencham Jewellers — Luxury E-Commerce Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

A full-stack, production-deployed luxury e-commerce platform for showcasing and selling authentic, certified Sri Lankan gemstones and fine jewellery.

---

## ✨ Features

- 🔐 **Multi-Factor Authentication** — JWT sessions, Google OAuth 2.0, Email OTP password reset
- 💳 **Secure Payment Gateway** — PayHere integration with MD5 cryptographic hashing
- 📦 **Order Lifecycle Management** — Place, track, cancel, and return orders via a user dashboard
- 📧 **Automated Transactional Emails** — Order confirmations, cancellations & more via Brevo SMTP
- 💎 **GIA Certificate Viewer** — Dedicated gemstone certification verification per product
- 🛒 **Dynamic Cart System** — Global cart state managed via React Context API
- 📱 **Fully Responsive** — Mobile-first luxury dark theme design

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, React Router, CSS3, Context API |
| **Backend** | Node.js, Express.js (RESTful APIs) |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, bcryptjs, Google OAuth 2.0 |
| **Payments** | PayHere Payment Gateway |
| **Email** | Nodemailer, Brevo SMTP |
| **Deployment** | Vercel (Frontend + Serverless Backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Brevo SMTP account

### 1. Clone the repository
```bash
git clone https://github.com/Nimradha/bencham_Website1.git
cd bencham_Website1
```

### 2. Set up environment variables
```bash
# Copy the example env file and fill in your values
cp .env.example backend/.env
```

### 3. Install dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Run locally
```bash
# Run backend (from /backend)
npm start

# Run frontend (from /frontend)
npm start
```

---

## 📁 Project Structure

```
bencham_Website1/
├── backend/          # Node.js + Express REST API
│   ├── server.js
│   └── vercel.json
├── frontend/         # React.js SPA
│   ├── src/
│   │   ├── components/
│   │   └── App.js
└── .env.example      # Environment variable template
```

---

## 🔒 Security

- All secrets and API keys are stored in `.env` files (excluded from Git via `.gitignore`)
- Passwords hashed using `bcryptjs`
- Payment requests secured with MD5 cryptographic hashing
- See [`.env.example`](.env.example) for required environment variables

---

## 👤 Author

**Nimradha Nethmini**
- **GitHub:** [@Nimradha](https://github.com/Nimradha)

