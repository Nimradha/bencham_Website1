import React from "react";
import { FaRegEye } from "react-icons/fa";
import {LuTarget} from "react-icons/lu";
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaCertificate } from "react-icons/fa";
import  {App} from "../App.css";

const About = () => {
    const about = {
        width: '90%',
        background: '#27001a',
        padding: '30px 30px 30px 30px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(173, 149, 81, 0.6)',
        display: 'flex',          
        flexDirection: 'column',     
        marginLeft: 'auto',
        marginRight: 'auto',
        
    };
    const paragraphStyle = {
        fontWeight: '400',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '18px',
    };
    const textContainer = {
        flex: "1",
        maxWidth: "600px", // keeps line width readable
        textAlign: "left", // ensures text aligns left
     };
    const video = {
        width: '350px',
        height: '500px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        
        objectFit: 'cover',
        cursor: 'pointer',
    };
    const vision = {
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#27001a',
        color: 'white',
        
        padding: '20px',
        textAlign: 'center',
        height: '300px',
        width: '300px'
    };
    const videoGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '5px',
        margin: '40px 0',
    };
    const visionSection = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '40px',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '40px auto',
        maxWidth: '1000px',
    };
    const videoItem = {
        width: '100%',
    };
    const sectionStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "50px 100px",
    backgroundColor: "#f8faff",
    flexWrap: "wrap", 
    gap: "150px",
  };

    return (
        <>
             <div style={about}>
                <div style={{ backgroundColor: "#27001a", padding: "2rem", display: "flex",position: "relative", alignItems: "flex-start",gap: "70px" }}>
  
  
                  <div style={{ flex: "1", maxWidth: "65%" }}>
                     <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "35px", color: "#cdaf5b", marginBottom: "1rem",textAlign: "left" }}>
                        Our Certification Promise
                     </h1>
                     <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "20px", color: "#ebe2c7", lineHeight: 1.6 ,textAlign: "left",wordBreak:"normal",overflowWrap:"normal"}}>
                       Every gemstone in our collection comes with a comprehensive certification of authenticity from Srilankan renowned gemological laboratories.
                       We believe in total transparency providing you with documented peace of mind regarding the origin, quality and natural state of your pendant.
                     </p>
                  </div>

  
                  <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
    
                    <div className="aboutcard" style={{
                     position: "relative",
                     backgroundColor: "#27001a",
                     borderRadius: "12px",
                     padding: "1rem",
                     boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                     zIndex: 1
                    }}>
                      <div className="card-header" style={{ borderBottom: "1px solid rgba(205,175,91,0.2)", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
                         <div className="bar-short" style={{ height: "8px", width: "50px", backgroundColor: "rgba(205,175,91,0.4)", marginBottom: "4px" }}></div>
                         <div className="bar-long" style={{ height: "16px", width: "150px", backgroundColor: "rgba(255,255,255,0.1)" }}></div>
                      </div>

                      <div className="card-content">
                         <div className="line" style={{ height: "8px", width: "100%", backgroundColor: "rgba(255,255,255,0.05)", marginBottom: "4px" }}></div>
                         <div className="line" style={{ height: "8px", width: "100%", backgroundColor: "rgba(255,255,255,0.05)", marginBottom: "4px" }}></div>
                         <div className="line-short" style={{ height: "8px", width: "75%", backgroundColor: "rgba(255,255,255,0.05)" }}></div>
                      </div>

                      <div className="card-footer" style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#cdaf5b" }}>verified</span>
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined"
                      style={{
                      fontSize: "150px",
                      color: "#cdaf5b",
                      opacity: 0.2,
                        
                    }}
                    >
                      verified_user
                    </span>
                </div>

            </div>
             </div>

             <section style={videoGrid}>
                <div style={videoItem}>
                    <video style={video} muted autoPlay loop playsInline  >
                        <source src="/videos/v1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div style={videoItem}>
                    <video style={video} muted autoPlay loop playsInline >
                        <source src="/videos/v2.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div style={videoItem}>
                    <video style={video} muted autoPlay loop playsInline >
                        <source src="/videos/v3.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                
            </section>
            <section style={visionSection}>
                <div style={vision}>
                    <FaRegEye size={50} color="white" />
                    <h2>Our Vision</h2>
                    <p style={paragraphStyle}>To be the most trusted and respected jeweller, known for our commitment to quality, craftsmanship, and customer satisfaction.</p>
                </div>
                <div style={vision}>
                    <LuTarget size={50} color="white" />
                    <h2>Our Mission</h2>
                    <p style={paragraphStyle}>To provide our customers with exquisite, high-quality jewellery that celebrates life's special moments, while upholding the highest standards of integrity and craftsmanship.</p>
                </div>
                <div style={vision}>
                    <FaHandHoldingHeart size={50} color="white" />
                    <h2>Our Values</h2>
                    <p style={paragraphStyle}>Quality, Integrity, Customer Satisfaction, Craftsmanship, Innovation, Community Engagement.</p>
                </div>
            </section>
            
            <div style={sectionStyle}>
                <video style={video} muted autoPlay loop playsInline >
                        <source src="/videos/v4.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                </video>
                 <div style={textContainer}>
                   <h1>Opportunity and Support</h1>
                   <h2>
                      Are you searching for the perfect place to showcase your one-of-a-kind creations?
                   </h2>
                   <p style={paragraphStyle}>
                      At Bencham Jewellers, we’re committed to providing a platform where talented artists
                      and artisans can showcase and sell their unique crafts and connect with customers
                      who appreciate and value handmade goods. We understand the search for the perfect
                      platform to showcase and sell your creations, and we’re here to offer you that very
                      opportunity.
                   </p>
                   <p style={paragraphStyle}>
                      Whether you’re a seasoned crafter or just beginning your creative journey, 
                      sparkleberry.co is here to support you every step of the way. We provide tools 
                      and resources designed to help you thrive in your craft business.
                   </p>
                 </div>
            </div>
             
        </>
        
    );

};

export default About;