import React from "react";
import  {App} from "../App.css";
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import { detailsData } from "./Details";

const Featured = () => {
    const featuredIds = [9, 2, 19, 25];
const navigate = useNavigate();
const handleImageClick = (id) => {
     navigate(`/details/${id}`);
   };
  return (
    <section className="featured-section">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h2 style={{textAlign:"left",padding:"0 100px",color:"white"}}>Featured Masterpieces</h2>
         <span
          style={{
          color: "#e0c200",
          cursor: "pointer",
          fontWeight: "500",
          marginRight: "100px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
         }}
          onClick={() => navigate("/product")}
        >
          Explore All <FaArrowRight size={12}/>
        </span>

      </div>
      
      <div className="featured-grid">
        {featuredIds.map((id) => {
          const p = detailsData[id]; 
          return (
            <div key={id} className="product-card">
              <img src={p.image} alt={p.title} />
              <div className="product-info">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3>{p.title}</h3>
                  <span>Rs. {p.price}</span> 
                </div>
                <p style={{ margin: 0, textAlign: "left", color: "#ebe2c7" }}>{p.description}</p>
              </div>
              <button style={{ backgroundColor: "#e0c200" }} onClick={() => handleImageClick(id)}>View Details</button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Featured;