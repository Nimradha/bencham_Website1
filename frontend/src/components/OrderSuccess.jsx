import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaUserCheck, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "white" }}>
        <h2>No Order Information Found</h2>
        <p style={{ color: "#b9c7de", marginTop: "10px" }}>Please place an order from the shop.</p>
        <button
          onClick={() => navigate("/product")}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#ad9551",
            color: "black",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Browse Products
        </button>
      </div>
    );
  }

  const { _id, items, shippingAddress, paymentMethod, cardLast4, totalAmount, createdAt } = order;

  return (
    <div style={{
      maxWidth: "750px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#27001a",
      borderRadius: "12px",
      border: "1px solid rgba(173, 149, 81, 0.6)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      color: "white",
      fontFamily: "'Montserrat', sans-serif"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", paddingBottom: "25px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <FaCheckCircle style={{ fontSize: "60px", color: "#4cd137", marginBottom: "15px" }} />
        <h1 style={{ margin: "0 0 10px 0", color: "#cdaf5b", fontSize: "28px" }}>Payment Successful!</h1>
        <p style={{ color: "#b9c7de", fontSize: "16px", margin: 0 }}>
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <span style={{
          display: "inline-block",
          marginTop: "12px",
          padding: "6px 14px",
          backgroundColor: "rgba(173, 149, 81, 0.15)",
          border: "1px solid #ad9551",
          borderRadius: "20px",
          color: "#ad9551",
          fontSize: "13px",
          fontWeight: "600"
        }}>
          Order ID: #{_id ? _id.toUpperCase() : "BENCHAM-ORD"}
        </span>
      </div>

      {/* Grid Layout for Order Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", margin: "25px 0" }}>
        {/* Shipping Information */}
        <div style={{
          padding: "18px",
          backgroundColor: "rgba(255,255,255,0.04)",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.08)"
        }}>
          <h3 style={{ color: "#cdaf5b", fontSize: "16px", marginTop: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <FaMapMarkerAlt /> Shipping Address
          </h3>
          {shippingAddress && (
            <div style={{ fontSize: "14px", color: "#b9c7de", lineHeight: "1.6" }}>
              <strong style={{ color: "white" }}>{shippingAddress.fullName}</strong> ({shippingAddress.label})<br />
              {shippingAddress.phone}<br />
              {shippingAddress.addressLine}<br />
              {shippingAddress.city}, {shippingAddress.district}, {shippingAddress.province}
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div style={{
          padding: "18px",
          backgroundColor: "rgba(255,255,255,0.04)",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.08)"
        }}>
          <h3 style={{ color: "#cdaf5b", fontSize: "16px", marginTop: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <FaCreditCard /> Payment Summary
          </h3>
          <div style={{ fontSize: "14px", color: "#b9c7de", lineHeight: "1.6" }}>
            <p style={{ margin: "4px 0" }}>
              <strong>Method:</strong> {paymentMethod === "card" ? `Credit Card (ending in ${cardLast4 || "****"})` : paymentMethod}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Status:</strong> <span style={{ color: "#4cd137", fontWeight: "bold" }}>Paid</span>
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Date:</strong> {new Date(createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Item Details */}
      <div style={{
        padding: "18px",
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.08)",
        marginBottom: "25px"
      }}>
        <h3 style={{ color: "#cdaf5b", fontSize: "16px", marginTop: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <FaShoppingBag /> Purchased Items
        </h3>
        {items && items.map((item, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "15px", paddingTop: "10px" }}>
            {item.image && (
              <img src={item.image} alt={item.title} style={{ width: "65px", height: "65px", borderRadius: "8px", objectFit: "cover" }} />
            )}
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 4px 0", color: "white", fontSize: "15px" }}>{item.title}</h4>
              <p style={{ margin: 0, color: "#b9c7de", fontSize: "13px" }}>Quantity: {item.quantity}</p>
            </div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#cdaf5b" }}>
              LKR {(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "18px", fontWeight: "bold" }}>
          <span>Total Paid:</span>
          <span style={{ color: "#4cd137" }}>LKR {totalAmount ? totalAmount.toFixed(2) : "0.00"}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
        <button
          onClick={() => navigate("/product")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#ad9551",
            color: "black",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/manageAccount")}
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            color: "#cdaf5b",
            fontWeight: "bold",
            border: "1px solid #cdaf5b",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          View Account Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
