import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaFacebook, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
import {ToastContainer, toast} from 'react-toastify';
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
  const [status, setStatus] = React.useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info("Sending message...", {position: "top-center"});
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
      
      const data =await response.json();
      
      if (response.ok) {
        toast.success("Message sent successfully!", {position: "top-center"});
        setFormData({
          name: '',
          email: '',
          phone: '',
          location: '',
          message: '',
        });
      } else {
        toast.error("Failed to send message.", {position: "top-center"});

      }
    } catch(err) {
      console.error(err);
      toast.error("An error occurred.", {position: "top-center"});
    }
  };

    
  const container = {
    backgroundColor: '#27001a',
    fontFamily: "'Montserrat', sans-serif",
  };

  const topSection = {
    backgroundColor: '#ad9551',
    color: '#27001a',
    padding: '40px 120px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const headingStyle = {
    fontWeight: '500',
    fontSize: '28px',
    lineHeight: '1.4',
  };

  const contactButton = {
    backgroundColor: '#27001a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const contactContent = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '60px',
    padding: '60px 120px',
    backgroundColor: '#27001a',
  };

  const contactInfo = {
    width: '35%',
      background: 'rgba(255,255,255,0.05)',
  };

  const contactForm = {
    width: '40%',
    background: '#27001a',
    padding: '30px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(173, 149, 81, 0.6)',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid rgba(173, 149, 81, 0.4)',
    borderRadius: '4px',
    fontFamily: "'Montserrat', sans-serif",
    marginRight: '10px',
    background: '#27001a',
    color: 'white',
  };

  const formButton = {
    backgroundColor: '#c3a75a',
    color: 'black',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
  };

  const formButtonHover = {
    backgroundColor: '#27001a',
  };

  const heading = {
    color: 'white',
    fontWeight: '500',
    marginBottom: '30px',
    fontSize: '30px',
    marginLeft: '-70px',
    fontFamily: "'montserrat', sans-serif",
  };

  const iconStyle = { marginLeft: '20px', color: '#27001a',fontSize: '22px' };

  const socialIcons = {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
    marginLeft: '105px',
  };

  return (
    <div style={container}>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "35px", color: "#cdaf5b" }}>Contact Our Boutique</h1>
            <p style={{fontFamily: "'Montserrat', sans-serif",fontSize: "20px",color: "#ebe2c7"}}>Experience the brilliance of natural certified gems.Our concierges are<br></br> available to assist with custom orders and inquires.</p>
      

      {/* Contact info and form */}
      <div style={contactContent}>
        {/* Left side */}
        <div style={contactInfo}>
          <h2 style={heading}>Contact Info</h2>
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "20px" ,marginLeft:"77px"}}>
            <FaMapMarkerAlt style={{ color: "#c3a75a", fontSize: "20px", marginRight: "10px", marginTop: "4px" }} />
            <div>
              <strong style={{ color: "#c3a75a" ,marginLeft:"-60px"}}>Address</strong>
              <p style={{ margin: "5px 0 0 0", color: "white" ,marginBottom:"20px"}}>Horana,SriLanka</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "20px" ,marginLeft:"77px"}}>
            <FaPhone style={{ color: "#c3a75a", fontSize: "20px", marginRight: "10px", marginTop: "4px" }} />
            <div>
              <strong style={{ color: "#c3a75a" ,marginLeft:"-30px"}}>Call Us</strong>
              <p style={{ margin: "5px 0 0 0", color: "#c3a75a", marginBottom: "20px" }}>
  <a
    href="tel:+775850202"
    style={{
      color: "white",
      textDecoration: "none",
      transition: "color 0.3s ease",
    }}
    onMouseOver={(e) => (e.target.style.color = "#ebe2c7")}
    onMouseOut={(e) => (e.target.style.color = "white")}
  >
    +775850202
  </a>
</p>

            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "20px" ,marginLeft:"77px"}}>
            <FaEnvelope style={{ color: "#c3a75a", fontSize: "20px", marginRight: "10px", marginTop: "4px" }} />
            <div>
              <strong style={{ color: "#c3a75a" ,marginLeft:"-160px"}}>Email Us</strong>
              <p style={{
                 margin: "10px 0 0 0",
                 marginBottom: "20px",
                 color: "#c3a75a",
                 display: "block", // ensures it's treated as a block-level element
             }}>
           <a
           href="mailto:fonseka.chamath@gmail.com"
           style={{
            color: "white",
            textDecoration: "none",
            transition: "color 0.3s ease",
            display: "inline-block", // makes it easier to control positioning
            marginTop: "5px",
          }}
          onMouseOver={(e) => (e.target.style.color = "#ebe2c7")}
          onMouseOut={(e) => (e.target.style.color = "white")}
         >
          fonseka.chamath@gmail.com
         </a>
       </p>


            </div>
          </div>

          

          <h3 style={{color:"white",marginLeft:"-100px"}}>Follow Us On</h3>
          <div style={socialIcons}>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={35} color="#1877F2" />
            </a>
            <a href="https://www.instagram.com/benchamjewellers?igsh=ajBsNmsyazU1amlr" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={35} color="#E4405F" />
            </a>
            <a href="https://www.youtube.com/@BenChamMores" target="_blank" rel="noopener noreferrer">
                <FaYoutube size={35} color="#FF0000" />
            </a>
            
          </div>
        </div>

        {/* Right side */}
        <div style={contactForm}>
          <h2 style={heading}>Send Us A Message!</h2>
          <form onSubmit={handleSubmit}>

            <div style={{ display: "flex", gap: "100px"}}>
              <div style={{ display: "flex", flexDirection: "column",gap: "10px",alignItems: "flex-start" }}>
                <label style={{color:"white"}}>Full Name</label>
                <input type="text" name="name" placeholder="Name" style={inputStyle} value={formData.name} onChange={handleChange} required/>
              </div>
              <div style={{ display: "flex", flexDirection: "column",gap: "10px",alignItems: "flex-start" }}>
                <label style={{color:"white"}}>Phone Number</label>
                <input type="text" name='phone' placeholder="Phone No." style={inputStyle} value={formData.phone} onChange={handleChange} required/>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px",alignItems: "flex-start" }}>
                <label style={{color:"white"}}>Email Address</label>
                <input type="email" name='email' placeholder="Email" style={inputStyle} value={formData.email} onChange={handleChange} required/>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px",alignItems: "flex-start" }}>
                <label style={{color:"white"}}>Location</label>
                <input type="text" name='location' placeholder="Location" style={inputStyle} value={formData.location} onChange={handleChange} required/>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px",alignItems: "flex-start" }}>
                <label style={{color:"white"}}>Message</label>
                <textarea placeholder="Message" name='message' rows="5" style={inputStyle} value={formData.message} onChange={handleChange} required></textarea>
            </div>
            
            <button type="submit" style={formButton}>Submit</button>
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
