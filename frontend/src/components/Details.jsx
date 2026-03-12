import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import  {App} from "../App.css";
import { MdOpenInFull } from "react-icons/md";


export const detailsData = {
  
  2: {
    title: "Luxury Necklace",
    description: "Perfect necklace for weddings and special occasions.",
    price: 3200,
    image:"/images/fig2.png"
  },
  4: {
    title: "Classic Bracelet4",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig4.png"
  },
  5: {
    title: "Classic Bracelet5",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig5.png"
  },
  6: {
    title: "Classic Bracelet6",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig6.png"
  },
  1: {
    title: "Classic Bracelet1",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig1.png"
  },
  7: {
    title: "Classic Bracelet7",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig7.png"
  },
  8: {
    title: "Classic Bracelet8",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig8.png"
  },
  9: {
    title: "Classic Bracelet9",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig9.png"
  },
  11: {
    title: "Classic Bracelet11",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig11.png"
  },
  12: {
    title: "Classic Bracelet12",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig12.png"
  },
  13: {
    title: "Classic Bracelet13",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig13.png"
  },
  14: {
    title: "Classic Bracelet14",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig14.png"
  },
  15: {
    title: "Classic Bracelet15",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig15.png"
  },
  16: {
    title: "Classic Bracelet16",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig16.png"
  },
  17: {
    title: "Classic Bracelet17",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig17.png"
  },
  18: {
    title: "Classic Bracelet18",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig18.png"
  },
  19: {
    title: "Classic Bracelet19",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig19.png"
  },
  21: {
    title: "Classic Bracelet21",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig21.png"
  },
  22: {
    title: "Classic Bracelet22",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig22.png"
  },
  24: {
    title: "Classic Bracelet24",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig24.png"
  },
  25: {
    title: "Classic Bracelet25",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig25.png"
  },
  26: {
    title: "Classic Bracelet26",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig26.png"
  },
  27: {
    title: "Classic Bracelet27",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig27.png"
  },
  28: {
    title: "Classic Bracelet28",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig28.png"
  },
  29: {
    title: "Classic Bracelet29",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig29.png"
  },
  30: {
    title: "Classic Bracelet30",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig30.png"
  },
  32: {
    title: "Classic Bracelet32",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig32.png"
  },
  33: {
    title: "Classic Bracelet33",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig33.png"
  },
  35: {
    title: "Classic Bracelet35",
    description: "Stylish bracelet with modern elegant design.",
    price: 1800,
    image:"/images/fig35.png"
  }
  // add more as needed
};





const Details = () => {
    const { id } = useParams();
    const item = detailsData[id];
    const [quantity, setQuantity] = useState(1);
    
    const navigate = useNavigate();

    const {state} = useLocation(); 
    const { addToCart } = useContext(CartContext);
    const { cartItems, increaseQty, decreaseQty, removeFromCart } = useContext(CartContext);
    const cartItem = cartItems.find(item => item.id === id);
    const isLoggedIn = () => {
     return sessionStorage.getItem("user") !== null;
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
    const handleAddToCart = () => {
       if (!isLoggedIn()) {
        navigate("/login", {
        state: { from: window.location.pathname }
       });
        return;
      }

      if (!item) return;

      addToCart({
       id,
       title: item.title,
       price: item.price,
       quantity: quantity,
       image: item.image
      });

      alert("Item added to cart!");
    };



    const handleBuyNow = () => {
        if (!isLoggedIn()) {
          navigate("/login", {
           state: { from: window.location.pathname }
          });
          return;
        }

        if (!item) return;

        navigate("/buy", {
           state: {
               id,
               title: item.title,
               price: item.price,
               quantity: quantity,
               image: item.image
           }
        });
    };
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };



    return (
  <div className="details-container">
    <div className="image"> 
      <img src={item.image} alt={`Image ${id}`} style={{width:"60%"}} />
    </div>

    <div className="details" style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <h1 style={{ margin: "0 0 5px 0" }}>{item ? item.title : `Figure ${id}`}</h1>
      {item && <h2 style={{color:"#ad9551",margin:"0"}}>Rs.{item.price * quantity}</h2>}

      <p>
        {item ? item.description : `No description available for Figure ${id}.`}
      </p>

      <div className="certificate-card">
        <div className="certificate-header">
          <h3 className="certificate-title">
            <span className="certificate-icon">verified</span>
               GIA Certification
          </h3>
          <button className="certificate-button" onClick={toggleExpand}>
              Expand  <MdOpenInFull size={18} />
          </button>
        </div>

        <div className="certificate-body">
          <div className={`certificate-image-container ${isExpanded ? "expanded" : ""}`}>
            <div
                className="certificate-image"
                data-alt="GIA certificate paper details"
                style={{ backgroundImage: `url('/images/cer.png')` }}
                ></div>
            </div>

            <div className="certificate-info">
                 <p className="certificate-label">Report Number</p>
                 <p className="certificate-number">2458903341</p>
                 <p className="certificate-text">
                    Authenticity and origin verified by the Gemological Institute of America.
                 </p>
            </div>
          </div>
          {isExpanded && (
        <div className="overlay" onClick={toggleExpand}>
          <div
            className="overlay-image"
            style={{ backgroundImage: `url('/images/cer.png')` }}
          ></div>
        </div>
      )}
        </div>

      

      <div style={{ marginTop: "20px", display: "flex", flexDirection:"column", gap:"25px", alignItems:"center" }}>
        {/* Quantity Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <h3 style={{ color: "#5a5a5a", fontWeight: "500", margin: 0 }}>Quantity</h3>

          <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} style={{ width:"35px", height:"35px", border:"1px solid #ddd", background:"#f5f5f5", cursor:"pointer", fontSize:"18px" }}>
            -
          </button>

          <span style={{ fontSize:"18px", padding:"0 10px" }}>{quantity}</span>

          <button onClick={() => setQuantity(quantity + 1)} style={{ width:"35px", height:"35px", border:"1px solid #ddd", background:"#f5f5f5", cursor:"pointer", fontSize:"18px" }}>
            +
          </button>
        </div>

        {/* Buttons Row */}
        <div style={{ display:"flex", gap:"20px" }}>
          <button style={contactButton} onClick={handleBuyNow}>Buy Now</button>
          <button style={contactButton} onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
    <div className="checkout">
  {cartItem ? (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center" }}>
        LKR {cartItem.price * cartItem.quantity}.00
      </h2>

      <button
        style={{
          width: "80%",
          padding: "12px",
          backgroundColor: "#ad9551",
          border: "none",
          borderRadius: "25px",
          fontSize: "18px",
          cursor: "pointer",
          marginTop: "10px"
        }}
        onClick={handleBuyNow}
      >
        Checkout
      </button>

      <button
        style={{
          width: "80%",
          padding: "12px",
          backgroundColor: "white",
          border: "none",
          borderRadius: "25px",
          fontSize: "18px",
          cursor: "pointer",
          marginTop: "10px"
        }}
        onClick={() => navigate("/cart")}
      >
        Go to cart
      </button>

      <hr style={{ margin: "20px 0" }} />

      <div style={{ display: "flex", gap: "10px" }}>
        <img
          src={cartItem.image}
          alt="cart"
          style={{ width: "80px", borderRadius: "10px" }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center", textAlign: "center" }}>
          <h4 style={{ margin: 0 }}>{cartItem.title}</h4>
          <h3>LKR {cartItem.price}.00</h3>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={() => decreaseQty(cartItem.id)}
              style={{ width: "30px", height: "30px" }}
            >
              -
            </button>

            <span>{cartItem.quantity}</span>

            <button
              onClick={() => increaseQty(cartItem.id)}
              style={{ width: "30px", height: "30px" }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <h3 style={{ textAlign: "center", marginTop: "50px", fontFamily: "'Montserrat', sans-serif", fontWeight: "500" }}>
      
    </h3>
  )}
</div>

  </div>
);

};
export default Details;