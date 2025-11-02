import React from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
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
    width: "380px",
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
    width: "100%",
    padding: "12px",
    backgroundColor: "#27001a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
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

        {/* Google & SSO buttons */}
        <button style={oauthButton}>
          <FcGoogle size={22} /> Continue with Google
        </button>
        

        {/* Divider */}
        <div style={divider}>
          <div style={line}></div>
          <span style={{ margin: "0 10px" }}>or</span>
          <div style={line}></div>
        </div>

        {/* Email and password inputs */}
        <input type="email" placeholder="Email address or username" style={input} />
        <input type="password" placeholder="Password" style={input} />

        <div style={{ textAlign: "right", marginBottom: "15px" }}>
          <a href="#" style={{ color: "#ad9551", fontSize: "16px", textDecoration: "none" }}>
            Forgot your password?
          </a>
        </div>

        <button style={button}>Continue</button>

        <p style={{ marginTop: "20px", fontSize: "16px" }}>
          Don't have an account?{" "}
          <a href="#" style={{ color: "#ad9551", textDecoration: "none" }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
