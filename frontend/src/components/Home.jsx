import { useNavigate } from "react-router-dom";
import React from "react";
import  {App} from "../App.css";
import { FaArrowRight } from "react-icons/fa";
import Featured from "./Featured";
import WhyChoose from "./WhyChoose";

const Home = () => {
  const navigate = useNavigate();
    
    return (
        <>
        <section className="hero-section">
            <div className="hero-container">
                <div className="hero-left">

                   <span className="hero-label">
                    The 2026 Gold Collection
                   </span>

                   <h1 className="hero-title">
                     Exquisite Natural
                   <br />
                   <span className="hero-highlight">Gem Pendants</span>
                   </h1>

                   <p className="hero-description">
                      Discover our signature 18k gold collection featuring certified emeralds and rare gemstones,handcrafted for timeless elegance.
                   </p>

                   <div className="hero-buttons">
                     <button className="btn-primary" onClick={() => navigate("/product")}>
                       Shop Collection <FaArrowRight className="arrow-icon" />
                     </button>
                   </div>

                </div>

                <div className="hero-right">
                    <div className="hero-image-container">
                        <img
                         src="/images/fig15.png"
                         alt="Gem Pendant"
                         className="hero-image"
                        />

                        <div className="certified-card">
                          <span className="material-symbols-outlined cert-icon">verified</span>
                          <div>
                            <p className="cert-title">Certified Authentic</p>
                            <p className="cert-text">Every piece includes a global laboratory <br></br>certificate of authenticity.</p>
                          </div>
                        </div>
                    </div>
                  
                </div>

            </div>
        </section>

        <Featured />

        <WhyChoose />
            
            
        </>
    );

};
export default Home;