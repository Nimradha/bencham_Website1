import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddressFormModal from "./AddressFormModal";
import { CartContext } from "./CartContext";

const Buy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart, removeSelectedItems } = useContext(CartContext);

  const rawState = location.state;
  const initialItems = React.useMemo(() => {
    if (!rawState) return [];
    if (rawState.items && Array.isArray(rawState.items)) {
      return rawState.items;
    }
    return [rawState];
  }, [rawState]);

  const [itemsList, setItemsList] = useState(initialItems);
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
  const [isCOD, setIsCOD] = useState(false);

  const subtotal = itemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

    if (!itemsList || itemsList.length === 0) {
      setErrorMessage("No products selected for checkout.");
      return;
    }

    if (!addresses || addresses.length === 0) {
      setErrorMessage("Please add a shipping address before placing your order.");
      return;
    }

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

    // ── Handle Cash on Delivery (COD) ─────────────────────────────────────────
    if (selectedPayment === "cod") {
      const orderPayload = {
        items: itemsList.map(i => ({ title: i.title, price: i.price, quantity: i.quantity, image: i.image })),
        shippingAddress: latestAddress,
        paymentMethod: "Cash on Delivery (COD)",
        subtotal,
        tax,
        totalAmount: total,
        status: "Pending (COD)"
      };

      try {
        const res = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(orderPayload)
        });

        const data = await res.json();
        setIsProcessing(false);

        if (res.ok) {
          setIsCOD(true);
          setOrderSuccess(true);

          if (rawState?.fromCart && rawState?.selectedIds) {
            removeSelectedItems(rawState.selectedIds);
          } else if (clearCart) {
            clearCart();
          }

          setTimeout(() => {
            // Ensure status is always "Pending (COD)" for COD orders regardless of API response
            const orderToShow = { ...orderPayload, ...(data.order || {}), status: "Pending (COD)" };
            navigate("/order-success", { state: { order: orderToShow } });
          }, 1000);
        } else {
          setErrorMessage(data.message || "Failed to place Cash on Delivery order.");
        }
      } catch (err) {
        console.error("COD order error:", err);
        setIsProcessing(false);
        setErrorMessage("Network error placing COD order. Please try again.");
      }
      return;
    }

    // ── Handle Online Payment via PayHere Gateway ──────────────────────────────
    try {
      const res = await fetch("http://localhost:3000/api/payhere/generate-hash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: total,
          currency: "LKR",
          items: itemsList.map(i => ({ title: i.title, price: i.price, quantity: i.quantity, image: i.image })),
          shippingAddress: latestAddress
        })
      });

      const paymentObject = await res.json();

      if (!res.ok) {
        setIsProcessing(false);
        setErrorMessage(paymentObject.message || "Failed to initialize PayHere payment.");
        return;
      }

      if (window.payhere) {
        window.payhere.onCompleted = async function onCompleted(orderId) {
          console.log("PayHere Payment completed. OrderID:" + orderId);
          setIsProcessing(false);
          setOrderSuccess(true);

          const orderPayload = {
            items: itemsList.map(i => ({ title: i.title, price: i.price, quantity: i.quantity, image: i.image })),
            shippingAddress: latestAddress,
            paymentMethod: "PayHere Online Gateway",
            subtotal,
            tax,
            totalAmount: total,
            status: "Paid"
          };

          let savedOrder = {
            _id: orderId,
            ...orderPayload,
            createdAt: new Date().toISOString()
          };

          try {
            const saveRes = await fetch("http://localhost:3000/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(orderPayload)
            });
            const saveResult = await saveRes.json();
            if (saveRes.ok && saveResult.order) {
              savedOrder = saveResult.order;
            }
          } catch (err) {
            console.error("Local order save failed:", err);
          }

          if (rawState?.fromCart && rawState?.selectedIds) {
            removeSelectedItems(rawState.selectedIds);
          } else if (clearCart) {
            clearCart();
          }

          setTimeout(() => {
            navigate("/order-success", { state: { order: savedOrder } });
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

  if (!itemsList || itemsList.length === 0) {
    return <h2 style={{ textAlign: "center", color: "white", marginTop: "50px" }}>No products selected</h2>;
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

          {/* Online Payment via PayHere Option */}
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

            {/* Dynamic PayHere Notice */}

          </div>

          {/* Cash on Delivery Option */}
          <div className="payment-option-container" style={{ marginTop: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="radio"
                id="payment-cod"
                name="payment"
                value="cod"
                checked={selectedPayment === "cod"}
                onChange={(e) => setSelectedPayment(e.target.value)}
              />
              <label htmlFor="payment-cod" style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#b9c7de" }}>
                <FaMoneyBillWave style={{ marginRight: "8px", color: "#4cd137", fontSize: "18px" }} />
                <span>Cash on Delivery (COD)</span>
              </label>
            </div>

            {/* Dynamic COD Notice */}
            {selectedPayment === "cod" && (
              <div style={{ marginTop: "12px", padding: "10px 14px", backgroundColor: "rgba(76, 209, 55, 0.1)", border: "1px solid rgba(76, 209, 55, 0.3)", borderRadius: "6px", fontSize: "13px", color: "#b9c7de" }}>
                💵 <strong>Cash on Delivery:</strong> Pay with cash upon delivery of your package to your shipping address.
              </div>
            )}
          </div>
        </div>

        {/* Selected Product Summary */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <h3 style={{ color: "white", fontFamily: "'Montserrat', sans-serif", margin: 0 }}>Selected Products ({itemsList.length})</h3>
          {itemsList.map((item, idx) => (
            <div key={item.id || idx} style={{ display: "flex", gap: "15px", alignItems: "center", borderBottom: idx < itemsList.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none", paddingBottom: idx < itemsList.length - 1 ? "15px" : "0" }}>
              <img
                src={item.image}
                alt={item.title}
                style={{ width: "70px", height: "70px", borderRadius: "10px", objectFit: "cover" }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                <h4 style={{ margin: 0, color: "#b9c7de", fontFamily: "'Montserrat', sans-serif", fontSize: "15px" }}>{item.title}</h4>
                <h3 style={{ margin: 0, color: "#798598", fontSize: "14px" }}>LKR {(item.price * item.quantity).toFixed(2)}</h3>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                  <button
                    onClick={() =>
                      setItemsList(itemsList.map(i =>
                        i.id === item.id ? { ...i, quantity: i.quantity > 1 ? i.quantity - 1 : 1 } : i
                      ))
                    }
                    style={{ width: "26px", height: "26px", backgroundColor: "#ad9551", borderRadius: "4px", border: "none", color: "white", fontWeight: "bold", cursor: "pointer" }}
                  >
                    -
                  </button>

                  <span style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>{item.quantity}</span>

                  <button
                    onClick={() =>
                      setItemsList(itemsList.map(i =>
                        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                      ))
                    }
                    style={{ width: "26px", height: "26px", backgroundColor: "#ad9551", borderRadius: "4px", border: "none", color: "white", fontWeight: "bold", cursor: "pointer" }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
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
          <div style={{ padding: "12px", backgroundColor: isCOD ? "rgba(243,156,18,0.15)" : "rgba(40,167,69,0.2)", border: `1px solid ${isCOD ? "#f39c12" : "#28a745"}`, borderRadius: "8px", marginTop: "15px", textAlign: "center", color: isCOD ? "#f39c12" : "#4cd137", fontSize: "14px" }}>
            {isCOD ? <>⏳ <strong>Order Placed!</strong><br />Your Cash on Delivery order has been registered.</> : <>🎉 <strong>Payment Successful!</strong><br />Your order has been placed.</>}
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

