import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";


const Footer = () => {
  const topSection = {
    backgroundColor: "#ad9551", // gold color
    color: "#27001a",
    padding: "30px 200px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  };

  const contactButton = {
    backgroundColor: "#27001a", // purple button
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  };

  const bottomSection = {
    backgroundColor: "#27001a", // purple
    color: "white",
    padding: "40px 80px 20px 80px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  };

  const column = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const heading = {
    color: "#ad9551",
    fontWeight: "500",
    marginBottom: "8px",
    fontFamily: "'Montserrat', sans-serif",
  };

  const link = {
    color: "white",
    textDecoration: "none",
    fontSize: "15px",
  };

  const socialIcons = {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
    marginLeft: "110px",
  };

  const bottomText = {
    textAlign: "center",
    backgroundColor: "#27001a",
    color: "white",
    fontSize: "14px",
    paddingBottom: "20px",
  };
  const headingStyle = {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "500",
    fontSize: "26px",
    fontoptionalsize: "32px",
  };

  return (
    <footer>
      {/* Top Contact Section */}
      <div style={topSection}>
        <h2 style={headingStyle}>If you have any questions or need <br/>assistance please reach out to us</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "60px" }}>
          <button style={contactButton}>Contact Us</button>
          <h3>Call : +77 585 0202</h3>
        </div>
      </div>

      {/* Bottom Purple Section */}
      <div style={bottomSection}>
        <div>
          <div className='logo' style={{ marginTop: "-38px" }}>
                <img src="/images/logo1.png" alt="Logo" style={{ height: "200px" }} />
          </div>
          <div style={{marginTop:"-30px",color:"#ad9551",fontFamily:"'Montserrat', sans-serif",fontWeight:"500"}}>Follow Us</div>
          <div style={socialIcons}>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} color="white" />
            </a>
            <a href="https://www.instagram.com/benchamjewellers?igsh=ajBsNmsyazU1amlr" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} color="white" />
            </a>
            <a href="https://www.youtube.com/@BenChamMores" target="_blank" rel="noopener noreferrer">
              <FaYoutube size={24} color="white" />
            </a>
          </div>
        </div>

        <div style={column}>
          <div style={heading}>Shop with Us</div>
          <a href="#home" style={link}>Home</a>
          <a href="#about" style={link}>About Us</a>
          <a href="#marketplace" style={link}>Marketplace</a>
          <a href="#account" style={link}>My Account</a>
          <a href="#blog" style={link}>Blog</a>
        </div>

        <div style={column}>
          <div style={heading}>Sell with Us</div>
          <a href="#why" style={link}>Why Sell with Us</a>
          <a href="#create" style={link}>Create your own shop</a>
          <a href="#vendor" style={link}>Vendor Account</a>
          <a href="#contact" style={link}>Contact Us</a>
        </div>

        <div style={column}>
          <div style={heading}>Quick Links</div>
          <a href="#privacy" style={link}>Privacy Policy</a>
          <a href="#terms" style={link}>Terms & Conditions</a>
          <a href="#refund" style={link}>Refund & Cancellation Policy</a>
          <a href="#agreement" style={link}>User Agreement</a>
        </div>
      </div>

      {/* Copyright */}
      <div style={bottomText}>
        © 2025 Bencham Jewellers. All Rights Reserved. 
      </div>
    </footer>
  );
};

export default Footer;
