import { FaCreditCard ,FaGooglePay,FaPaypal,FaCcVisa} from "react-icons/fa";
import React, { useState } from "react";
import { useLocation ,useNavigate} from "react-router-dom";
import { useEffect } from "react";
import AddressFormModal from "./AddressFormModal";


const Buy = () => {
  const location = useLocation();
  const product = location.state;
  const [cartItem, setCartItem] = useState(product);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState("");

  const subtotal = cartItem ? cartItem.price * cartItem.quantity : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

useEffect(() => {
  const fetchAddresses = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3000/api/address", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setAddresses(data);
      }

    } catch (error) {
      console.error(error);
    }
  };

  fetchAddresses();
}, []);

  const handleSaveAddress = (newAddr) => {
    setAddresses(prev => [...prev, newAddr]);
  };


  if (!cartItem) {
  return <h2 style={{ textAlign: "center" }}>No product selected</h2>;
}



  return (
    <div className="checkout-container">
      <div className="checkout-left">
        <div className="card">
          <h3 style={{color:"white",fontFamily:"'Montserrat', sans-serif"}}>Shipping address</h3>
          <button
           className="add-address-btn"
           onClick={() => setShowAddressModal(true)}
          >
          + Add new address
          </button>

          <div style={{ marginTop: "15px" }}>
  {addresses.length === 0 ? (
    <p style={{ color: "#b9c7de" }}>No saved addresses</p>
  ) : (
    (() => {
      const latest = addresses[addresses.length - 1]; // get the most recent
      return (
        <div
          key={latest._id}
          style={{
            border: "1px solid #ad9551",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "10px",
            color: "#b9c7de",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        >
          <h4>{latest.fullName} ({latest.label})</h4>
          <p>{latest.phone}</p>
          <p>{latest.addressLine}</p>
          <p>{latest.city}, {latest.district}, {latest.province}</p>
        </div>
      );
    })()
  )}
</div>

        </div>

        <div className="card">
          <h3 style={{color:"white",fontFamily:"'Montserrat', sans-serif"}}>Payment Methods</h3>

          <div className="payment-option" style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <input type="radio" name="payment" />
            <FaCreditCard style={{ marginRight: "8px" ,color:"#b9c7de"}} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
               <span style={{color:"#b9c7de",marginLeft:"16px"}}>Add a new card</span>
               <div style={{ display: "flex", gap: "8px", alignItems:"flex-start",marginLeft:"16px" }}>
                 <button style={{height:"28px",background:"white",border:"1px solid black",marginRight:"10px"}}><img src="/images/visa-logo-svgrepo-com.svg" height={"25px"}></img></button>
                 <button style={{height:"28px",background:"white",border:"1px solid black"}}><img src="/images/mastercard-svgrepo-com.svg" height={"25px"}></img></button>
               </div>
            </div>
            
          </div>

          <div className="payment-option">
            <input type="radio" name="payment" />
            <img src="/images/google-pay-primary-logo-logo-svgrepo-com.svg" style={{ marginRight: "8px" ,height:"30px"}} />
            <span style={{color:"#b9c7de"}}>Google Pay</span>
          </div>

          <div className="payment-option">
            <input type="radio" name="payment" />
            <FaPaypal style={{ marginRight: "8px" ,color:"blue"}} />
            <span style={{color:"#b9c7de",marginLeft:"14px"}}>PayPal</span>
          </div>
        </div>
      
        <div className="card">
          

          <div style={{ display: "flex", gap: "10px" }}>
               <img
                src={cartItem.image}
                alt="cart"
                style={{ width: "80px", borderRadius: "10px" }}
               />

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" ,alignItems: "center",textAlign: "center" }}>
              <h4 style={{margin:0,color:"#b9c7de",fontFamily:"'Montserrat', sans-serif"}}>{cartItem.title}</h4>
              <h3 style={{color:"#798598"}}>LKR {(cartItem.price * cartItem.quantity).toFixed(2)}</h3>

              <div style={{ display: "flex", alignItems: "center", gap: "10px",justifyContent: "center" }}>

                <button
                 onClick={() =>
                 setCartItem({
                  ...cartItem,
                  quantity: cartItem.quantity > 1
                    ? cartItem.quantity - 1
                    : 1
                })
              }
                 style={{ width: "30px", height: "30px" ,backgroundColor:"#ad9551",borderRadius:"10%"}}
               >
                  -
               </button>

              <span style={{color:"white"}}>{cartItem.quantity}</span>

              <button
              onClick={() =>
                setCartItem({
                  ...cartItem,
                  quantity: cartItem.quantity + 1
                })
              }
              style={{ width: "30px", height: "30px",backgroundColor:"#ad9551",borderRadius:"10%" }}
              >
                +
              </button>
      
              

          </div>
        </div>
      </div>


        </div>
      </div>

      <div className="summary-card">
        <h2 style={{fontStyle:"italic",fontFamily:"'Montserrat', sans-serif",color:"white"}}> Order Summary</h2>

        <div className="summary-row">
          <span style={{color:"#b9c7de"}}>Subtotal</span>
          <span style={{color:"white"}}>LKR {subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span style={{color:"#b9c7de"}}>Taxes</span>
          <span style={{color:"white"}}>LKR {tax.toFixed(2)}</span>
        </div>

        <hr />

        <div className="summary-row total">
          <span style={{color:"#b9c7de"}}>Total</span>
          <span style={{color:"white"}}>LKR {total.toFixed(2)}</span>
        </div>

        <button className="place-order" style={{color:"black",fontFamily:"'Montserrat', sans-serif",fontWeight:"bold"}}>Place order</button>
      </div>
      {showAddressModal && (
        <AddressFormModal
          onClose={() => setShowAddressModal(false)}
          onSaved={handleSaveAddress}
        />
      )}

    </div>
  );
};

export default Buy;
