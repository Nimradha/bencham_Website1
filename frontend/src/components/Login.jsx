import React from "react";
import { useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useGoogleLogin } from "@react-oauth/google";
import { API_BASE_URL } from "../config";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
    alert("Please enter email and password");
    return;
   }
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userEmail", email);
        window.dispatchEvent(new Event("userChanged"));
        navigate(location.state?.from?.pathname || "/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("login failed");
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  const login = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: tokenResponse.access_token }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userEmail", data.email);
        window.dispatchEvent(new Event("userChanged"));
        navigate(location.state?.from?.pathname || "/");
      } else {
        alert(data.message || "Google login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Google login error: " + (err.message || "Network error"));
    }
  },
  onError: () => {
    console.log("Google Login Failed");
    alert("Google sign-in failed. Please try again.");
  },
 });
  const container = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#27001a",
    fontFamily: "'Inter', sans-serif",
  };

  const card = {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: "0 40px 40px 40px",
    borderRadius: "8px",
    width: "450px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
    textAlign: "center",
    height: "620px",
    border: '1px solid rgba(173, 149, 81, 0.6)',
  };
const loginImage = {
  position: "relative",
  height: "180px",
  width: "calc(100% + 80px)", // card width + left+right padding
  marginLeft: "-40px",
  marginBottom: "20px",
  borderRadius: "8px",
  overflow: "hidden",
};
const imageOverlay = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to bottom, rgba(88, 65, 65, 0.2) 30%, rgba(49, 2, 2, 0.8) 100%), rgba(255,255,255,0.05)",
  zIndex: 1,
};

const loginImageImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  zIndex: 0,
};

const overlayText = {
  position: "absolute",
  bottom: "20px",
  left: "20px",
  color: "white",
  textShadow: "0 2px 6px rgba(0,0,0,0.6)",
  zIndex: 2,
};

  const button = {
    width: "45%",
    padding: "12px",
    backgroundColor: "#d4be82",
    color: "black",
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
  color: "white",
};

const inputStyle = {
  width: "100%",       // THIS fixes left/right mismatch
  padding: "10px",
  marginBottom: "15px",
  border: '1px solid rgba(173, 149, 81, 0.6)',
  borderRadius: "4px",
  boxSizing: "border-box", // VERY IMPORTANT
  backgroundColor: "#161201",
  color: "white",
};






  return (
    <div style={container}>
      <div style={card}>
        <div style={loginImage}>
          <img
           src="/images/pendant.png"
           alt="pendant"
           style={loginImageImg}
          />

          <div style={imageOverlay}></div>

          <div style={overlayText}>
               <h1 style={{ margin: 0, fontSize: "26px",textAlign: "left",marginLeft: "20px" }}>Welcome Back</h1>
               <p style={{ margin: 0, fontSize: "14px",marginLeft: "20px",textAlign: "left",color:"rgba(255, 255, 255, 0.6)" }}>
                 Access your exclusive jewelry collection
               </p>
          </div>
        </div>

        <h2 style={{ marginBottom: "20px" , color: "#cdaf5b",fontSize: "20px",fontStyle: "italic"}}>Log in to your account</h2>

        
         <div style={formContainer}>
             <label style={labelStyle}>Email</label><br></br>
             <div style={{position: "relative"}}>
                <span className="material-symbols-outlined" style={{
                   position: "absolute",
                   left: "12px",
                   top: "40%",
                   transform: "translateY(-50%)",
                   color: "#999",
                   pointerEvents: "none", // so it doesn't block input
                  }}>mail</span>
                <input type="email" placeholder="name@bencham.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{
                   ...inputStyle,
                    paddingLeft: "50px", // make space for the icon
                 }}/>
             </div>
             

             <label style={labelStyle}>Password</label><br></br>
             <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
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
          style={{ fontSize: "14px", color: "#ebe2c7", cursor: "pointer" }}
        >
          Remember me
        </label>
      </div>
        

        <div style={{display: "flex",justifyContent: "center",gap: "20px", }}>

         <button
          style={button}
          onClick={handleLogin}
        >
           Login
         </button>


         <button style={button} onClick={()=>login()}>
          <FcGoogle size={22} style={{ marginRight: "10px" }} />
          Sign in with Google
         </button>
        </div>


        <p style={{ marginTop: "20px", fontSize: "14px" ,color:"#ebe2c7"}}>
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
