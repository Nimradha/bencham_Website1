import { FaCreditCard ,FaGooglePay,FaPaypal,FaCcVisa} from "react-icons/fa";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";


const Buy = () => {
  const location = useLocation();
  const product = location.state;
  const [cartItem, setCartItem] = useState(product);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selected, setSelected] = useState("");

  const subtotal = cartItem.price * cartItem.quantity;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [addressLine, setAddressLine] = useState("");

  const handleSaveAddress = async () => {
   try {
    const token = localStorage.getItem("token"); // assuming you saved JWT here
    const res = await fetch("http://localhost:3000/api/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        fullName,
        phone,
        province,
        district,
        city,
        addressLine,
        label: selected
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Address saved successfully!");
      setShowAddressModal(false);
      // optionally reset form
      setFullName("");
      setPhone("");
      setProvince("");
      setDistrict("");
      setCity("");
      setAddressLine("");
      setSelected("");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to save address");
  }
};


  if (!cartItem) {
  return <h2 style={{ textAlign: "center" }}>No product selected</h2>;
}

  return (
    <div className="checkout-container">
      <div className="checkout-left">
        <div className="card">
          <h3>Shipping address</h3>
          <button
           className="add-address-btn"
           onClick={() => setShowAddressModal(true)}
          >
          + Add new address
          </button>

        </div>

        <div className="card">
          <h3>Payment Methods</h3>

          <div className="payment-option" style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <input type="radio" name="payment" />
            <FaCreditCard style={{ marginRight: "8px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
               <span>Add a new card</span>
               <div style={{ display: "flex", gap: "8px", alignItems:"flex-start" }}>
                 <button style={{height:"28px",background:"white",border:"1px solid black",marginRight:"10px"}}><img src="/images/visa-logo-svgrepo-com.svg" height={"25px"}></img></button>
                 <button style={{height:"28px",background:"white",border:"1px solid black"}}><img src="/images/mastercard-svgrepo-com.svg" height={"25px"}></img></button>
               </div>
            </div>
            
          </div>

          <div className="payment-option">
            <input type="radio" name="payment" />
            <img src="/images/google-pay-primary-logo-logo-svgrepo-com.svg" style={{ marginRight: "8px" ,height:"30px"}} />
            <span>Google Pay</span>
          </div>

          <div className="payment-option">
            <input type="radio" name="payment" />
            <FaPaypal style={{ marginRight: "8px" ,color:"blue"}} />
            <span>PayPal</span>
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
              <h4 style={{margin:0}}>{cartItem.title}</h4>
              <h3>LKR {(cartItem.price * cartItem.quantity).toFixed(2)}</h3>

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
                 style={{ width: "30px", height: "30px" }}
               >
                  -
               </button>

              <span>{cartItem.quantity}</span>

              <button
              onClick={() =>
                setCartItem({
                  ...cartItem,
                  quantity: cartItem.quantity + 1
                })
              }
              style={{ width: "30px", height: "30px" }}
              >
                +
              </button>
      
              

          </div>
        </div>
      </div>


        </div>
      </div>

      <div className="summary-card">
        <h3>Summary</h3>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>LKR {subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Taxes</span>
          <span>LKR {tax.toFixed(2)}</span>
        </div>

        <hr />

        <div className="summary-row total">
          <span>Total</span>
          <span>LKR {total.toFixed(2)}</span>
        </div>

        <button className="place-order">Place order</button>
      </div>
      {showAddressModal && (
        <div className="modal-overlay">
           <div className="modal-box">

              <div className="modal-header">
                <h2>Add new shipping Address</h2>
                <span
                 className="close-btn"
                 onClick={() => setShowAddressModal(false)}
                >
                ✕
               </span>
              </div>

              <div className="form-grid"> 
                <div className="form-group">
                   <label>Full Name</label>
                   <input placeholder="Enter your First and Last name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>

                <div className="form-group">
                   <label>Phone Number</label>
                   <input placeholder="Please enter your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="form-group">
                   <label>Province</label>
                   
                   <select value={province} onChange={(e) => setProvince(e.target.value)}>
                      <option value="">Please choose your Province</option>
                      <option value="Central">Central</option>
                      <option value="Eastern">Eastern</option>
                      <option value="Northern">Northern</option>
                      <option value="North Western">North Western</option>
                      <option value="North Central">North Central</option>
                      <option value="Southern">Southern</option>
                      <option value="Sabaragamuwa">Sabaragamuwa</option>
                      <option value="Uva">Uva</option>
                      <option value="Western">Western</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>District</label>
                    
                    <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                      <option value="">Please choose your District</option>
                      <option value="Ampara">Ampara</option>
                      <option value="Batticaloa">Batticaloa</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Galle">Galle</option>
                      <option value="Hambantota">Hambantota</option>
                      <option value="Jaffna">Jaffna</option>
                      <option value="Kalutara">Kalutara</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Kilinochchi">Kilinochchi</option>
                      <option value="Matale">Matale</option>
                      <option value="Mannar">Mannar</option>
                      <option value="Mullaitivu">Mullaitivu</option>
                      <option value="Matara">Matara</option>
                      <option value="Nuwara Eliya">Nuwara Eliya</option>
                      <option value="Trincomalee">Trincomalee</option>
                      <option value="Vavuniya">Vavuniya</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>City</label>
                    
                    <select value={city} onChange={(e) => setCity(e.target.value)}>
                      <option value="">Please choose your City</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                      <option value="Jaffna">Jaffna</option>
                      <option value="Batticaloa">Batticaloa</option>
                      <option value="Trincomalee">Trincomalee</option>
                      <option value="Matara">Matara</option>
                      <option value="Matale">Matale</option>
                      <option value="Nuwara Eliya">Nuwara Eliya</option>
                      <option value="Ampara">Ampara</option>
                      <option value="Vavuniya">Vavuniya</option>
                      <option value="Mannar">Mannar</option>
                      <option value="Hambantota">Hambantota</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Horana">Horana</option>
                      <option value="Mullaitivu">Mullaitivu</option>
                      <option value="Kilinochchi">Kilinochchi</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Address</label>
                    <input placeholder="eg.142/4,Yalagala Road,Wewala,Horana" value={addressLine} onChange={(e) => setAddressLine(e.target.value)}/>
                </div>
              </div>
              <div>
                <p style={{textAlign:"left"}}>Select a label for effective delivery</p>
                <div className="buttons2">
                  <button
                   className={`btn2 ${selected === "office" ? "active" : ""}`}
                   onClick={() => setSelected("office")}
                  >
                    <img src="/images/office-briefcase-svgrepo-com (1).svg" height={"20px"}/> 
                    <span>OFFICE</span> 
                  </button>
                  <button
                   className={`btn2 ${selected === "home" ? "active" : ""}`}
                   onClick={() => setSelected("home")}
                  >
                    <img src="/images/home-svgrepo-com (1).svg" height={"20px"}/> 
                    <span>HOME</span> 
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                 <button
                  className="cancel-btn"
                  onClick={() => setShowAddressModal(false)}
                 >
                  Cancel
                 </button>

                 <button
                  className="save-btn"
                  onClick={handleSaveAddress}
                 >
                  Save
                 </button>
              </div>

            </div>
          </div>
)}

    </div>
  );
};

export default Buy;
