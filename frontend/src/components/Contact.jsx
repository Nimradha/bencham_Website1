import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaFacebook, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';

const Contact = () => {
  const container = {
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
  };

  const contactInfo = {
    width: '35%',
    color: '#27001a',
  };

  const contactForm = {
    width: '60%',
    background: '#fff',
    padding: '30px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontFamily: "'Montserrat', sans-serif",
  };

  const formButton = {
    backgroundColor: '#27001a',
    color: 'white',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: "'Montserrat', sans-serif",
  };

  const formButtonHover = {
    backgroundColor: '#27001a',
  };

  const heading = {
    color: '#27001a',
    fontWeight: '500',
    marginBottom: '30px',
    fontSize: '32px',
    marginLeft: '-70px',
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
      

      {/* Contact info and form */}
      <div style={contactContent}>
        {/* Left side */}
        <div style={contactInfo}>
          <h2 style={heading}>Contact Info</h2>
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "20px" ,marginLeft:"77px"}}>
            <FaMapMarkerAlt style={{ color: "#27001a", fontSize: "20px", marginRight: "10px", marginTop: "4px" }} />
            <div>
              <strong style={{ color: "#27001a" ,marginLeft:"-60px"}}>Address</strong>
              <p style={{ margin: "5px 0 0 0", color: "#27001a" ,marginBottom:"20px"}}>Horana,SriLanka</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "20px" ,marginLeft:"77px"}}>
            <FaPhone style={{ color: "#27001a", fontSize: "20px", marginRight: "10px", marginTop: "4px" }} />
            <div>
              <strong style={{ color: "#27001a" ,marginLeft:"-30px"}}>Call Us</strong>
              <p style={{ margin: "5px 0 0 0", color: "#27001a", marginBottom: "20px" }}>
  <a
    href="tel:+775850202"
    style={{
      color: "#27001a",
      textDecoration: "none",
      transition: "color 0.3s ease",
    }}
    onMouseOver={(e) => (e.target.style.color = "#ad9551")}
    onMouseOut={(e) => (e.target.style.color = "#27001a")}
  >
    +775850202
  </a>
</p>

            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "20px" ,marginLeft:"77px"}}>
            <FaEnvelope style={{ color: "#27001a", fontSize: "20px", marginRight: "10px", marginTop: "4px" }} />
            <div>
              <strong style={{ color: "#27001a" ,marginLeft:"-160px"}}>Email Us</strong>
              <p style={{
                 margin: "10px 0 0 0",
                 marginBottom: "20px",
                 color: "#27001a",
                 display: "block", // ensures it's treated as a block-level element
             }}>
           <a
           href="mailto:fonseka.chamath@gmail.com"
           style={{
            color: "#27001a",
            textDecoration: "none",
            transition: "color 0.3s ease",
            display: "inline-block", // makes it easier to control positioning
            marginTop: "5px",
          }}
          onMouseOver={(e) => (e.target.style.color = "#ad9551")}
          onMouseOut={(e) => (e.target.style.color = "#27001a")}
         >
          fonseka.chamath@gmail.com
         </a>
       </p>


            </div>
          </div>

          

          <h3 style={heading}>Follow Us On</h3>
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
          <form>
            <input type="text" placeholder="Name" style={inputStyle} />
            <input type="email" placeholder="Email" style={inputStyle} />
            <input type="text" placeholder="Phone No." style={inputStyle} />
            <input type="text" placeholder="Location" style={inputStyle} />
            <textarea placeholder="Message" rows="5" style={inputStyle}></textarea>
            <button type="submit" style={formButton}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
