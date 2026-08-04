import React, { useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import "../App.css";
import { MdOpenInFull } from "react-icons/md";
import { isLoggedIn } from "./auth";
import LoginModal from "./LoginModal";
import { API_BASE_URL } from "../config";


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





// ── Once-per-day login prompt helper ─────────────────────────────────────────
// Key format: "loginPromptDate"  value: "YYYY-MM-DD"
// On the first Buy Now / Add to Cart click of the day we show the modal.
// After the user logs in (or if already logged in), we record today's date so
// we don't show it again until tomorrow.
const todayStr = () => new Date().toISOString().slice(0, 10); // "2025-07-21"

const hasPromptedToday = () =>
  localStorage.getItem("loginPromptDate") === todayStr();

const markPromptedToday = () =>
  localStorage.setItem("loginPromptDate", todayStr());

const Details = () => {
    const { id } = useParams();
    const item = detailsData[id];
    const [quantity, setQuantity] = useState(1);
    const [showLoginModal, setShowLoginModal] = useState(false);
    // pendingAction stores what to do after login succeeds
    const pendingAction = useRef(null);
    
    const navigate = useNavigate();

    const {state} = useLocation(); 
    const { addToCart } = useContext(CartContext);
    const { cartItems, increaseQty, decreaseQty, removeFromCart } = useContext(CartContext);
    const cartItem = cartItems.find(item => item.id === id);

    // ── Ratings & Reviews state ──────────────────────────────────────────────
    const [productReviews, setProductReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ totalReviews: 0, averageRating: 0, starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
    const [loadingReviews, setLoadingReviews] = useState(true);

    React.useEffect(() => {
      if (!id) return;
      const fetchProductReviews = async () => {
        try {
          setLoadingReviews(true);
          const res = await fetch(`${API_BASE_URL}/api/reviews/product/${id}`);
          if (res.ok) {
            const data = await res.json();
            setProductReviews(data.reviews || []);
            setReviewStats(data.stats || { totalReviews: 0, averageRating: 0, starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
          }
        } catch (err) {
          console.error("Failed to fetch product reviews:", err);
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchProductReviews();
    }, [id]);

    // Called when login succeeds inside the modal
    const handleModalLoginSuccess = () => {
      markPromptedToday();
      setShowLoginModal(false);
      // Retry the action that triggered the modal
      if (pendingAction.current) {
        pendingAction.current();
        pendingAction.current = null;
      }
    };

    // Guard: if not logged in, show modal on FIRST click of the day.
    // On subsequent clicks same day (already logged in), pass through.
    const requireLogin = (action) => {
      if (isLoggedIn()) {
        // Already authenticated — run immediately
        action();
        return;
      }
      // Not logged in — show modal (first time today: modal, after login: direct)
      pendingAction.current = action;
      setShowLoginModal(true);
    };

    



    const contactButton = {
      backgroundColor: "#ad9551", // purple button
      color: "black",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
    };
    const handleAddToCart = () => {
      requireLogin(() => {
        if (!item) return;
        addToCart({
          id,
          title: item.title,
          price: item.price,
          quantity: quantity,
          image: item.image,
        });
        alert("Item added to cart!");
      });
    };

    const handleBuyNow = () => {
      requireLogin(() => {
        if (!item) return;
        navigate("/buy", {
          state: {
            id,
            title: item.title,
            price: item.price,
            quantity: quantity,
            image: item.image,
          },
        });
      });
    };
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };



    return (
  <>
  <div className="details-container">
    <div className="image" style={{backgroundColor:"rgba(255,255,255,0.05)"}}> 
      <img src={item.image} alt={`Image ${id}`} style={{width:"60%"}} />
    </div>

    <div className="details" style={{display:"flex", flexDirection:"column", alignItems:"center",backgroundColor:"#27001a"}}>
      <h1 style={{ margin: "0 0 5px 0",color:"#d4af37",fontStyle:"italic" }}>{item ? item.title : `Figure ${id}`}</h1>
      {item && <h2 style={{color:"white",margin:"0"}}>Rs.{item.price * quantity}</h2>}

      <p style={{color:"#798598"}}>
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
        

        {/* Buttons Row */}
        <div style={{ display:"flex", gap:"20px" }}>
          <button style={contactButton} onClick={handleBuyNow}>Buy Now</button>
          <button style={contactButton} onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
    <div className="checkout" style={{backgroundColor:"#27001a"}}>
  {cartItem ? (
    <div style={{ padding: "20px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center",color:"#798598" }}>
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
        onClick={() => requireLogin(() => navigate("/cart"))}
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
          <h4 style={{ margin: 0 ,color:"#b9c7de"}}>{cartItem.title}</h4>
          <h3 style={{color:"#798598"}}>LKR {cartItem.price * cartItem.quantity}.00</h3>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={() => decreaseQty(cartItem.id)}
              style={{ width: "30px", height: "30px",backgroundColor:"#ad9551",borderRadius:"10%" }}
            >
              -
            </button>

            <span style={{color:"white"}}>{cartItem.quantity}</span>

            <button
              onClick={() => increaseQty(cartItem.id)}
              style={{ width: "30px", height: "30px" ,backgroundColor:"#ad9551",borderRadius:"10%"}}
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

    {/* ── Product Ratings & Reviews Section ── */}
    <div style={{
      maxWidth: "1100px",
      margin: "40px auto 60px",
      padding: "30px",
      backgroundColor: "rgba(39, 0, 26, 0.7)",
      border: "1px solid rgba(173, 149, 81, 0.3)",
      borderRadius: "12px",
      color: "white",
      fontFamily: "'Inter', sans-serif"
    }}>
      <h2 style={{ color: "#d4be82", marginTop: 0, marginBottom: "20px", fontSize: "22px", letterSpacing: "0.5px" }}>
        Ratings & Reviews
      </h2>

      {loadingReviews ? (
        <div style={{ color: "rgba(255,255,255,0.6)", padding: "20px 0" }}>Loading customer reviews...</div>
      ) : (
        <>
          {/* Summary & Rating Breakdown Box */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "30px",
            padding: "20px",
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: "30px",
            alignItems: "center"
          }}>
            {/* Average Score */}
            <div style={{ textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.1)", paddingRight: "20px" }}>
              <div style={{ fontSize: "44px", fontWeight: "bold", color: "#d4be82", lineHeight: 1 }}>
                {reviewStats.averageRating || "0.0"}
              </div>
              <div style={{ fontSize: "18px", color: "#f1c40f", margin: "6px 0" }}>
                {"★".repeat(Math.round(reviewStats.averageRating || 0)) + "☆".repeat(5 - Math.round(reviewStats.averageRating || 0))}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? "Rating" : "Ratings"}
              </div>
            </div>

            {/* Star Distribution Progress Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviewStats.starCounts?.[star] || 0;
                const pct = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                return (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px" }}>
                    <span style={{ width: "35px", color: "rgba(255,255,255,0.7)" }}>{star} ★</span>
                    <div style={{ flex: 1, height: "8px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "#f1c40f", borderRadius: "4px", transition: "width 0.3s" }} />
                    </div>
                    <span style={{ width: "30px", textAlign: "right", color: "rgba(255,255,255,0.4)" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Reviews List */}
          {productReviews.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {productReviews.map((rev, idx) => (
                <div key={rev._id || idx} style={{
                  padding: "16px",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.06)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: "600", fontSize: "14px", color: "#d4be82" }}>{rev.userName}</span>
                      <span style={{ fontSize: "10px", backgroundColor: "rgba(39,174,96,0.2)", color: "#2ecc71", border: "1px solid #27ae60", padding: "1px 6px", borderRadius: "4px" }}>
                        ✓ Verified Buyer
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Stars */}
                  <div style={{ color: "#f1c40f", fontSize: "14px", marginBottom: "8px" }}>
                    {"★".repeat(rev.rating) + "☆".repeat(5 - rev.rating)}
                  </div>

                  {/* Review Text */}
                  <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: "1.5" }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              backgroundColor: "rgba(255,255,255,0.02)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.5)",
              fontSize: "14px"
            }}>
              ⭐ No reviews yet for this product.<br />
              <span style={{ fontSize: "12px", opacity: 0.7 }}>Be the first to review this gemstone jewelry after your purchase!</span>
            </div>
          )}
        </>
      )}
    </div>


      {/* ── Login modal (Daraz-style popup) ── */}
      {showLoginModal && (
        <LoginModal
          onClose={() => {
            setShowLoginModal(false);
            pendingAction.current = null;
          }}
          onLoginSuccess={handleModalLoginSuccess}
        />
      )}
  </>
);

};
export default Details;