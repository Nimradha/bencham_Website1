import { FaCreditCard, FaGooglePay, FaPaypal, FaCcVisa, FaInfoCircle } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddressFormModal from "./AddressFormModal";

const Buy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;
  const [cartItem, setCartItem] = useState(product);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  
  // Payment states
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setErrorMessage("");

    // 1. Validate Shipping Address
    if (!addresses || addresses.length === 0) {
      setErrorMessage("Please add a shipping address before placing your order.");
      return;
    }

    // 2. Validate Payment Method selection
    if (!selectedPayment) {
      setErrorMessage("Please select a payment method.");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      setErrorMessage("Session expired. Please log in again.");
      return;
    }

    const latestAddress = addresses[addresses.length - 1];

    setIsProcessing(true);

    try {
      // Step 1: Request PayHere MD5 security hash from backend
      const res = await fetch("http://localhost:3000/api/payhere/generate-hash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: total,
          currency: "LKR",
          items: [{ title: cartItem.title, price: cartItem.price, quantity: cartItem.quantity }],
          shippingAddress: latestAddress
        })
      });

      const paymentObject = await res.json();

      if (!res.ok) {
        setIsProcessing(false);
        setErrorMessage(paymentObject.message || "Failed to initialize PayHere payment.");
        return;
      }

      // Step 2: Configure PayHere SDK Event Callbacks
      if (window.payhere) {
        window.payhere.onCompleted = function onCompleted(orderId) {
          console.log("PayHere Payment completed. OrderID:" + orderId);
          setIsProcessing(false);
          setOrderSuccess(true);

          setTimeout(() => {
            navigate("/order-success", {
              state: {
                order: {
                  _id: orderId,
                  items: [{ title: cartItem.title, price: cartItem.price, quantity: cartItem.quantity, image: cartItem.image }],
                  shippingAddress: latestAddress,
                  paymentMethod: "PayHere Gateway (" + selectedPayment + ")",
                  totalAmount: total,
                  createdAt: new Date().toISOString()
                }
              }
            });
          }, 1000);
        };

        window.payhere.onDismissed = function onDismissed() {
          console.log("PayHere Payment modal closed");
          setIsProcessing(false);
        };

        window.payhere.onError = function onError(error) {
          console.error("PayHere Error:", error);
          setIsProcessing(false);
          setErrorMessage("PayHere Payment Error: " + error);
        };

        // Step 3: Launch PayHere Modal Popup
        console.log("PayHere payment object:", paymentObject);
        window.payhere.startPayment(paymentObject);
      } else {
        setIsProcessing(false);
        setErrorMessage("PayHere SDK failed to load. Please refresh and try again.");
      }
    } catch (err) {
      console.error("Payment trigger error:", err);
      setIsProcessing(false);
      setErrorMessage("Network error connecting to payment gateway. Please try again.");
    }
  };

  if (!cartItem) {
    return <h2 style={{ textAlign: "center", color: "white", marginTop: "50px" }}>No product selected</h2>;
  }

  return (
    <div className="checkout-container">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .payment-option-container {
            cursor: pointer;
            padding: 12px;
            border-radius: 8px;
            transition: background-color 0.2s ease;
          }
          .payment-option-container:hover {
            background-color: rgba(255, 255, 255, 0.05);
          }
          .card-input-field {
            padding: 10px 12px;
            border-radius: 6px;
            border: 1px solid #ad9551;
            background-color: rgba(255, 255, 255, 0.08);
            color: white;
            outline: none;
            font-size: 14px;
            width: 100%;
            box-sizing: border-box;
          }
          .card-input-field::placeholder {
            color: #798598;
          }
        `}
      </style>

      <div className="checkout-left">
        {/* Shipping Address Section */}
        <div className="card">
          <h3 style={{ color: "white", fontFamily: "'Montserrat', sans-serif" }}>Shipping address</h3>
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

        {/* Payment Methods Section */}
        <div className="card">
          <h3 style={{ color: "white", fontFamily: "'Montserrat', sans-serif" }}>Payment Methods</h3>

          {/* Credit/Debit Card Option */}
          <div className="payment-option-container">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="radio"
                id="payment-card"
                name="payment"
                value="card"
                checked={selectedPayment === "card"}
                onChange={(e) => setSelectedPayment(e.target.value)}
              />
              <label htmlFor="payment-card" style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#b9c7de" }}>
                <FaCreditCard style={{ marginRight: "8px", color: "#ad9551" }} />
                <span>Credit / Debit Card</span>
              </label>
              <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
                <img src="/images/visa-logo-svgrepo-com.svg" alt="Visa" height="22px" style={{ background: "white", padding: "2px 4px", borderRadius: "3px" }} />
                <img src="/images/mastercard-svgrepo-com.svg" alt="Mastercard" height="22px" style={{ background: "white", padding: "2px 4px", borderRadius: "3px" }} />
              </div>
            </div>

            {/* Dynamic Card Form */}
            {selectedPayment === "card" && (
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "10px", paddingRight: "10px" }}>
                {/* Card Number Field */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "14px", color: "#b9c7de", fontFamily: "'Montserrat', sans-serif" }}>
                    <span style={{ color: "#ff4d4d", marginRight: "4px" }}>*</span>Card number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card number"
                    maxLength={19}
                    className="card-input-field"
                    value={cardDetails.cardNumber}
                    onChange={handleCardChange}
                  />
                </div>

                {/* Name on Card Field */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "14px", color: "#b9c7de", fontFamily: "'Montserrat', sans-serif" }}>
                    <span style={{ color: "#ff4d4d", marginRight: "4px" }}>*</span>Name on card
                  </label>
                  <input
                    type="text"
                    name="cardHolder"
                    placeholder="Name on card"
                    className="card-input-field"
                    value={cardDetails.cardHolder}
                    onChange={handleCardChange}
                  />
                </div>

                {/* Expiry Date & CVV Row */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "14px", color: "#b9c7de", fontFamily: "'Montserrat', sans-serif" }}>
                      <span style={{ color: "#ff4d4d", marginRight: "4px" }}>*</span>Expiry date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      maxLength={5}
                      className="card-input-field"
                      value={cardDetails.expiry}
                      onChange={handleCardChange}
                    />
                  </div>

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "14px", color: "#b9c7de", fontFamily: "'Montserrat', sans-serif", display: "flex", alignItems: "center", gap: "5px" }}>
                      <span><span style={{ color: "#ff4d4d", marginRight: "4px" }}>*</span>CVV</span>
                      <FaInfoCircle style={{ color: "#319795", fontSize: "13px", cursor: "pointer" }} title="3 or 4 digit code on the back of your card" />
                    </label>
                    <input
                      type="password"
                      name="cvv"
                      placeholder="CVV"
                      maxLength={4}
                      className="card-input-field"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                    />
                  </div>
                </div>

                {/* Card Save Disclaimer */}
                <p style={{ fontSize: "12px", color: "#8a99b5", lineHeight: "1.5", margin: "5px 0 5px 0" }}>
                  We will save this card for your convenience. If required, you can remove the card in the "Payment Options" section in the "Account" menu.
                </p>
              </div>
            )}
          </div>

          {/* Google Pay Option */}
          <div className="payment-option-container" style={{ marginTop: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="radio"
                id="payment-gpay"
                name="payment"
                value="googlepay"
                checked={selectedPayment === "googlepay"}
                onChange={(e) => setSelectedPayment(e.target.value)}
              />
              <label htmlFor="payment-gpay" style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#b9c7de" }}>
                <img src="/images/google-pay-primary-logo-logo-svgrepo-com.svg" alt="Google Pay" style={{ marginRight: "8px", height: "26px" }} />
                <span>Google Pay</span>
              </label>
            </div>
          </div>

          {/* PayPal Option */}
          <div className="payment-option-container" style={{ marginTop: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="radio"
                id="payment-paypal"
                name="payment"
                value="paypal"
                checked={selectedPayment === "paypal"}
                onChange={(e) => setSelectedPayment(e.target.value)}
              />
              <label htmlFor="payment-paypal" style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#b9c7de" }}>
                <FaPaypal style={{ marginRight: "8px", color: "#0070ba", fontSize: "20px" }} />
                <span>PayPal</span>
              </label>
            </div>
          </div>
        </div>

        {/* Selected Product Summary */}
        <div className="card">
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <img
              src={cartItem.image}
              alt="cart item"
              style={{ width: "80px", borderRadius: "10px", objectFit: "cover" }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <h4 style={{ margin: 0, color: "#b9c7de", fontFamily: "'Montserrat', sans-serif" }}>{cartItem.title}</h4>
              <h3 style={{ margin: 0, color: "#798598" }}>LKR {(cartItem.price * cartItem.quantity).toFixed(2)}</h3>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
                <button
                  onClick={() =>
                    setCartItem({
                      ...cartItem,
                      quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 1
                    })
                  }
                  style={{ width: "30px", height: "30px", backgroundColor: "#ad9551", borderRadius: "6px", border: "none", color: "white", fontWeight: "bold", cursor: "pointer" }}
                >
                  -
                </button>

                <span style={{ color: "white", fontWeight: "bold" }}>{cartItem.quantity}</span>

                <button
                  onClick={() =>
                    setCartItem({
                      ...cartItem,
                      quantity: cartItem.quantity + 1
                    })
                  }
                  style={{ width: "30px", height: "30px", backgroundColor: "#ad9551", borderRadius: "6px", border: "none", color: "white", fontWeight: "bold", cursor: "pointer" }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="summary-card">
        <h2 style={{ fontStyle: "italic", fontFamily: "'Montserrat', sans-serif", color: "white" }}>Order Summary</h2>

        <div className="summary-row">
          <span style={{ color: "#b9c7de" }}>Subtotal</span>
          <span style={{ color: "white" }}>LKR {subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span style={{ color: "#b9c7de" }}>Taxes</span>
          <span style={{ color: "white" }}>LKR {tax.toFixed(2)}</span>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "15px 0" }} />

        <div className="summary-row total">
          <span style={{ color: "#b9c7de" }}>Total</span>
          <span style={{ color: "white" }}>LKR {total.toFixed(2)}</span>
        </div>

        {/* Validation Error Message */}
        {errorMessage && (
          <p style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "10px", textAlign: "center", backgroundColor: "rgba(255,107,107,0.1)", padding: "8px", borderRadius: "6px" }}>
            ⚠️ {errorMessage}
          </p>
        )}

        {/* Payment Success Notification */}
        {orderSuccess ? (
          <div style={{ padding: "12px", backgroundColor: "rgba(40, 167, 69, 0.2)", border: "1px solid #28a745", borderRadius: "8px", marginTop: "15px", textAlign: "center", color: "#4cd137", fontSize: "14px" }}>
            🎉 <strong>Payment Successful!</strong><br />Your order has been placed.
          </div>
        ) : (
          <button
            className="place-order"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            style={{
              color: "black",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: "bold",
              cursor: isProcessing ? "not-allowed" : "pointer",
              opacity: isProcessing ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginTop: "15px"
            }}
          >
            {isProcessing ? (
              <>
                <span className="spinner" style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid black",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 1s linear infinite"
                }}></span>
                Processing Payment...
              </>
            ) : (
              "Place order"
            )}
          </button>
        )}
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

