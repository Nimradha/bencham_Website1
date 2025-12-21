import React from "react";
import { useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = () => {
    const [country, setCountry] = useState("");
  const container = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fb",
    fontFamily: "'Inter', sans-serif",
  };

  const card = {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    width: "450px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    textAlign: "center",
    height: "500px"
  };

  const input = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #d0d7de",
    borderRadius: "6px",
    fontSize: "16px",
  };

  const button = {
    width: "45%",
    padding: "12px",
    backgroundColor: "#27001a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
    justifyContent: "center",
    gap: "8px",
    display: "flex",
    alignItems: "center",
  };

  const divider = {
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
    color: "#999",
    fontSize: "14px",
  };

  const line = {
    flex: 1,
    height: "1px",
    backgroundColor: "#ddd",
  };

  const [rememberMe, setRememberMe] = useState(false);
  


  const formContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",       // takes full width
  maxWidth: "600px",   // keeps form neat
};

const labelStyle = {
  textAlign: "left",
  marginBottom: "6px",
  fontWeight: "500",
  color: "#27001a",
};

const inputStyle = {
  width: "100%",       // THIS fixes left/right mismatch
  padding: "10px",
  paddingRight: "80px", // space for eye icon
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box", // VERY IMPORTANT
};

const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

const eyeStyle = {
    position: "Absolute",
    top: "47%",
    right: "10px",
    cursor: "pointer",
  };



  const oauthButton = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    marginBottom: "10px",
    fontSize: "16px",
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ marginBottom: "20px" }}>Create Account</h2>

        
         <div style={{ display: "flex", gap: "20px" }}>
  
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
           <label style={labelStyle}>First Name</label>
           <input type="text" style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
           <label style={labelStyle}>Last Name</label>
           <input type="text" style={inputStyle} />
          </div>
         </div>

         <div style={{ display: "flex", gap: "20px" }}>
  
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
           <label style={labelStyle}>Email or Phone number</label>
           <input type="text" style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
           <label style={labelStyle}>Country</label>
           <select style={inputStyle} value={country} onChange={(e) => setCountry(e.target.value)}>
             <option value="">Select Country</option>
             <option value="Australia">Australia</option>
             <option value="Bangladesh">Bangladesh</option>
             <option value="Canada">Canada</option>
             <option value="Dubai">Dubai</option>
             <option value="India">India</option>
             <option value="NewZealand">NewZealand</option>
             <option value="Pakistan">Pakistan</option>
             <option value="Sri Lanka">Sri Lanka</option>
             <option value="United States">United States</option>
             <option value="United Kingdom">United Kingdom</option>
           </select>
          </div>
         </div>

         <div style={{ display: "flex", gap: "20px" }}>
      {/* Password */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
        <label style={labelStyle}>Password</label>
        <div>
          <input
            type={showPassword ? "text" : "password"}
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <FaEyeSlash style={eyeStyle} onClick={togglePassword} />
          ) : (
            <FaEye style={eyeStyle} onClick={togglePassword} />
          )}
        </div>
      </div>

      {/* Confirm Password */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
        <label style={labelStyle}>Confirm Password</label>
        <div >
          <input
            type={showPassword ? "text" : "password"}
            style={inputStyle}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {showPassword ? (
            <FaEyeSlash style={eyeStyle} onClick={togglePassword} />
          ) : (
            <FaEye style={eyeStyle} onClick={togglePassword} />
          )}
        </div>
      </div>
    </div>





        <div style={{ textAlign: "left", marginBottom: "15px" }}>
                  <Link to="/forgotPassword" style={{ color: "#ad9551", fontSize: "14px", textDecoration: "none" }}>
                     Forgot your password?
                  </Link>
        
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          style={{ marginRight: "8px", cursor: "pointer" }}
        />
        <label
          htmlFor="rememberMe"
          style={{ fontSize: "14px", color: "#27001a", cursor: "pointer" }}
        >
          Remember me
        </label>
      </div>
        

        <div style={{display: "flex",justifyContent: "center",gap: "20px", }}>
         <button style={button}>Create Account</button>
         <button style={button}>
          <FcGoogle size={22} style={{ marginRight: "10px" }} />
          Sign in with Google
         </button>
        </div>


        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#ad9551", textDecoration: "none" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
