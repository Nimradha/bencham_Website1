import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../config';

const Contact = () => {
  // Decode JWT to get logged-in user's email
  const getLoggedInEmail = () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return '';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || '';
    } catch { return ''; }
  };

  const [formData, setFormData] = React.useState({
    name: '',
    email: getLoggedInEmail(),
    phone: '',
    location: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info("Sending message...", { position: "top-center" });
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success("Message sent successfully!", { position: "top-center" });
        setFormData({
          name: '',
          email: '',
          phone: '',
          location: '',
          message: '',
        });
      } else {
        toast.error("Failed to send message.", { position: "top-center" });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.", { position: "top-center" });
    }
  };

  const container = {
    backgroundColor: '#27001a',
    fontFamily: "'Montserrat', sans-serif",
    paddingBottom: '60px',
  };

  const contactContent = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '30px',
    padding: '40px 5%',
    backgroundColor: '#27001a',
    flexWrap: 'wrap',
    boxSizing: 'border-box',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const contactInfo = {
    flex: '1 1 320px',
    maxWidth: '450px',
    background: 'rgba(255,255,255,0.05)',
    padding: '35px 30px',
    borderRadius: '10px',
    border: '1px solid rgba(173, 149, 81, 0.4)',
    boxSizing: 'border-box',
  };

  const contactForm = {
    flex: '1 1 400px',
    maxWidth: '600px',
    background: 'rgba(255,255,255,0.03)',
    padding: '35px 30px',
    borderRadius: '10px',
    border: '1px solid rgba(173, 149, 81, 0.6)',
    boxSizing: 'border-box',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid rgba(173, 149, 81, 0.4)',
    borderRadius: '6px',
    fontFamily: "'Montserrat', sans-serif",
    background: '#161201',
    color: 'white',
    boxSizing: 'border-box',
  };

  const formButton = {
    backgroundColor: '#c3a75a',
    color: 'black',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '16px',
    marginTop: '10px',
  };

  const heading = {
    color: '#ad9551',
    fontWeight: '600',
    marginBottom: '25px',
    fontSize: '26px',
    textAlign: 'left',
  };

  return (
    <div style={container}>
      <div style={{ padding: "40px 20px 10px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "32px", color: "#cdaf5b", margin: "0 0 10px 0" }}>Contact Our Boutique</h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "16px", color: "#ebe2c7", maxWidth: "700px", margin: "0 auto", lineHeight: "1.5" }}>
          Experience the brilliance of natural certified gems. Our concierges are available to assist with custom orders and inquiries.
        </p>
      </div>

      <div style={contactContent}>
        {/* Left side: Contact Info */}
        <div style={contactInfo}>
          <h2 style={heading}>Contact Info</h2>

          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "25px", gap: "15px", textAlign: "left" }}>
            <FaMapMarkerAlt style={{ color: "#c3a75a", fontSize: "22px", marginTop: "3px", flexShrink: 0 }} />
            <div>
              <strong style={{ color: "#c3a75a", display: "block", fontSize: "16px" }}>Address</strong>
              <p style={{ margin: "4px 0 0 0", color: "white" }}>Horana, Sri Lanka</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "25px", gap: "15px", textAlign: "left" }}>
            <FaPhone style={{ color: "#c3a75a", fontSize: "20px", marginTop: "3px", flexShrink: 0 }} />
            <div>
              <strong style={{ color: "#c3a75a", display: "block", fontSize: "16px" }}>Call Us</strong>
              <p style={{ margin: "4px 0 0 0" }}>
                <a
                  href="tel:+775850202"
                  style={{ color: "white", textDecoration: "none" }}
                  onMouseOver={(e) => (e.target.style.color = "#ebe2c7")}
                  onMouseOut={(e) => (e.target.style.color = "white")}
                >
                  +775850202
                </a>
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "30px", gap: "15px", textAlign: "left" }}>
            <FaEnvelope style={{ color: "#c3a75a", fontSize: "20px", marginTop: "3px", flexShrink: 0 }} />
            <div>
              <strong style={{ color: "#c3a75a", display: "block", fontSize: "16px" }}>Email Us</strong>
              <p style={{ margin: "4px 0 0 0" }}>
                <a
                  href="mailto:fonseka.chamath@gmail.com"
                  style={{ color: "white", textDecoration: "none", wordBreak: "break-all" }}
                  onMouseOver={(e) => (e.target.style.color = "#ebe2c7")}
                  onMouseOut={(e) => (e.target.style.color = "white")}
                >
                  fonseka.chamath@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div style={{ textAlign: "left" }}>
            <h3 style={{ color: "white", fontSize: "18px", marginBottom: "12px", marginTop: 0 }}>Follow Us On</h3>
            <div style={{ display: "flex", gap: "15px" }}>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={32} color="#1877F2" />
              </a>
              <a href="https://www.instagram.com/benchamjewellers?igsh=ajBsNmsyazU1amlr" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={32} color="#E4405F" />
              </a>
              <a href="https://www.youtube.com/@BenChamMores" target="_blank" rel="noopener noreferrer">
                <FaYoutube size={32} color="#FF0000" />
              </a>
            </div>
          </div>
        </div>

        {/* Right side: Contact Form */}
        <div style={contactForm}>
          <h2 style={heading}>Send Us A Message!</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 200px", textAlign: "left" }}>
                <label style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>Full Name</label>
                <input type="text" name="name" placeholder="Name" style={inputStyle} value={formData.name} onChange={handleChange} required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 200px", textAlign: "left" }}>
                <label style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>Phone Number</label>
                <input type="text" name='phone' placeholder="Phone No." style={inputStyle} value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
              <label style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>Email Address</label>
              <input type="email" name='email' placeholder="Email" style={inputStyle} value={formData.email} onChange={handleChange} required />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
              <label style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>Location</label>
              <input type="text" name='location' placeholder="Location" style={inputStyle} value={formData.location} onChange={handleChange} required />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
              <label style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>Message</label>
              <textarea placeholder="Message" name='message' rows="5" style={inputStyle} value={formData.message} onChange={handleChange} required></textarea>
            </div>
            
            <div style={{ textAlign: "left" }}>
              <button type="submit" style={formButton}>Submit</button>
            </div>
          </form>
        </div>

        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default Contact;
