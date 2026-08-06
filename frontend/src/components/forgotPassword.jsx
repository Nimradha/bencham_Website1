import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const container = {
    display: "flex",
    justifyContent: "center",   
    alignItems: "center",       
    minHeight: "80vh",         
    backgroundColor: "#27001a", 
    padding: "40px 20px",       
  };


  const card = {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    width: "450px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    textAlign: "center",
    height: "300px"
  };

  const button = {
    width: "40%",
    padding: "12px",
    backgroundColor: "#27001a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
    justifyContent: "center",
    alignItems: "center",
  };

  const handleSubmit = async (e) => {
  e.preventDefault(); 
  try {
    const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), 
    });

    const data = await response.json();

    if (response.ok) {
      alert("OTP sent to your email"); 
      navigate("/verifyOtp", { state: { email: email } }); 
    } else {
      alert(data.message || "Failed to send reset link.");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred. Please try again.");
  }
};


  return (
    <div style={container}>
     <div style={card}>
      <h2>Reset Password</h2>
      <p>Enter your email and we’ll send you a reset link.</p>

      <form onSubmit={handleSubmit}>
        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "15px",boxSizing: "border-box" }}
        required
      />

      <button type="submit" style={button}>
        Send Reset Link
      </button>

      </form>
      
     </div>
    </div>
  );
};

export default ForgotPassword;
