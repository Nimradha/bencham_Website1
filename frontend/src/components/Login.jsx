import React from "react";
import { useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useGoogleLogin } from "@react-oauth/google";


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const login = useGoogleLogin({
  onSuccess: tokenResponse => {
    sessionStorage.setItem("user", JSON.stringify(tokenResponse));
    navigate(location.state?.from?.pathname || "/");

  },
  onError: () => {
    console.log("Google Login Failed");
  },
 });
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
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box", // VERY IMPORTANT
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
        <h2 style={{ marginBottom: "20px" }}>Log in to your account</h2>

        
         <div style={formContainer}>
             <label style={labelStyle}>Email</label><br></br>
             <input type="email" style={inputStyle} />

             <label style={labelStyle}>Password</label><br></br>
             <input type="password" style={inputStyle} />
         </div><br></br>



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

         <button
          style={button}
          onClick={() => {
           sessionStorage.setItem("user", "loggedIn");
           navigate(location.state?.from || "/");
          }}
         >
           Login
         </button>


         <button style={button} onClick={()=>login()}>
          <FcGoogle size={22} style={{ marginRight: "10px" }} />
          Sign in with Google
         </button>
        </div>


        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/createAccount" style={{ color: "#ad9551", textDecoration: "none" }}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
