import React from "react";
import { FaShieldAlt, FaLeaf, FaGem } from "react-icons/fa";
import  {App} from "../App.css";

const WhyChoose = () => {
  return (
    <section className="why-section">
      <div className="why-container">

        {/* LEFT SIDE */}
        <div className="why-left">

          <h2 className="why-title">
            Why Choose Our <span className="hero-highlight">Gems</span>
          </h2>

          <p className="why-desc">
            Every piece in our collection is a testament to nature’s beauty,
            backed by rigorous certification and unmatched craftsmanship.
          </p>

          <div className="why-feature">

            <div className="why-item">
              <div className="icon-box">
                <FaShieldAlt />
              </div>

              <div>
                <h4 style={{textAlign:"left"}}>Certified Authenticity</h4>
                <p style={{textAlign:"left"}}>
                  Every gemstone comes with an independent laboratory certificate
                  verifying its natural origin and quality parameters.
                </p>
              </div>
            </div>


            <div className="why-item">
              <div className="icon-box">
                <FaLeaf />
              </div>

              <div>
                <h4 style={{textAlign:"left"}}>Ethically Sourced</h4>
                <p style={{textAlign:"left"}}>
                  We partner exclusively with mines that adhere to the highest
                  ethical and environmental standards globally.
                </p>
              </div>
            </div>


            <div className="why-item">
              <div className="icon-box">
                <FaGem />
              </div>

              <div>
                <h4 style={{textAlign:"left"}}>Master Craftsmanship</h4>
                <p style={{textAlign:"left"}}>
                  Our pendants are handcrafted by master jewelers using
                  traditional techniques and 18k solid gold.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="why-right">

          <img
            src="/images/why1.png"
            alt="craft"
            className="why-img"
          />

          <div className="why-card dark">
            <h4>✨</h4>
            <p>NATURAL GEMS ONLY</p>
          </div>

          <div className="why-card yellow">
            <p>GET YOUR DREAM NECKLACE <br></br>FROM US</p>
          </div>

          <img
            src="/images/why2.png"
            alt="gems"
            className="why-img"
          />

        </div>

      </div>
    </section>
  );
};

export default WhyChoose;