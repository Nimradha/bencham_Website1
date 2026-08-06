import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import { API_BASE_URL } from "../config";


const CreateAccount = () => {
    const [country, setCountry] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
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
            navigate("/");
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

    const togglePassword = () => setShowPassword(!showPassword);

    const validateForm = () => {
        const newErrors = {};
        if (!firstName.trim()) newErrors.firstName = "First name is required";
        if (!lastName.trim()) newErrors.lastName = "Last name is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
          newErrors.email = "Email is required";
        }else if (!emailRegex.test(email)) {
          newErrors.email = "Invalid email format";
        }
        if (!country) newErrors.country = "Country is required";

        if (!password) {
          newErrors.password = "Password is required";
        } else if (password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        }
        if (password !== confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

    const handleCreateAccount = async () => {
        if (!validateForm()) return;

        try {
          const res = await fetch(`${API_BASE_URL}/api/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
           },
            body: JSON.stringify({
            firstName,
            lastName,
            email,
            country,
            password,
            rememberMe,
            }),
          });

          const data = await res.json();

         if (res.ok) {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("userEmail", email);
          window.dispatchEvent(new Event("userChanged"));
          alert("Account created successfully!");
          navigate("/");
        } else {
          alert(data.message);
        }

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
      }
    };

      
  const container = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "85vh",
    backgroundColor: "#27001a",
    fontFamily: "'Inter', sans-serif",
    padding: "40px 20px",
  };

  const card = {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: "40px",
    borderRadius: "8px",
    width: "550px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
    textAlign: "center",
    border: "1px solid rgba(173, 149, 81, 0.6)",
    backdropFilter: "blur(10px)",
  };

  const primaryButton = {
    width: "48%",
    padding: "12px",
    backgroundColor: "#d4be82",
    color: "#000",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    marginTop: "10px",
    justifyContent: "center",
    gap: "8px",
    display: "flex",
    alignItems: "center",
  };

  const googleButton = {
    width: "48%",
    padding: "12px",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    border: "1px solid rgba(173, 149, 81, 0.6)",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    marginTop: "10px",
    justifyContent: "center",
    gap: "8px",
    display: "flex",
    alignItems: "center",
  };

  const errorStyle = {
    color: "#ff6b6b",
    fontSize: "12px",
    textAlign: "left",
    marginBottom: "10px",
  };

  const labelStyle = {
    textAlign: "left",
    marginBottom: "6px",
    fontWeight: "500",
    color: "white",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid rgba(173, 149, 81, 0.6)",
    borderRadius: "4px",
    boxSizing: "border-box",
    backgroundColor: "#161201",
    color: "white",
  };

  const eyeStyle = {
    position: "absolute",
    top: "40%",
    right: "10px",
    cursor: "pointer",
    transform: "translateY(-50%)",
    color: "#ad9551",
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ marginBottom: "25px", color: "#ad9551" }}>Create Account</h2>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label style={labelStyle}>First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle}/>
            {errors.firstName && <p style={errorStyle}>{errors.firstName}</p>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label style={labelStyle}>Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle}/>
            {errors.lastName && <p style={errorStyle}>{errors.lastName}</p>}
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label style={labelStyle}>Email or Phone number</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle}/>
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label style={labelStyle}>Country</label>
            <select style={inputStyle} value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="" style={{ backgroundColor: "#161201", color: "white" }}>Select Country</option>
              <option value="Australia" style={{ backgroundColor: "#161201", color: "white" }}>Australia</option>
              <option value="Bangladesh" style={{ backgroundColor: "#161201", color: "white" }}>Bangladesh</option>
              <option value="Canada" style={{ backgroundColor: "#161201", color: "white" }}>Canada</option>
              <option value="Dubai" style={{ backgroundColor: "#161201", color: "white" }}>Dubai</option>
              <option value="India" style={{ backgroundColor: "#161201", color: "white" }}>India</option>
              <option value="NewZealand" style={{ backgroundColor: "#161201", color: "white" }}>NewZealand</option>
              <option value="Pakistan" style={{ backgroundColor: "#161201", color: "white" }}>Pakistan</option>
              <option value="Sri Lanka" style={{ backgroundColor: "#161201", color: "white" }}>Sri Lanka</option>
              <option value="United States" style={{ backgroundColor: "#161201", color: "white" }}>United States</option>
              <option value="United Kingdom" style={{ backgroundColor: "#161201", color: "white" }}>United Kingdom</option>
            </select>
            {errors.country && <p style={errorStyle}>{errors.country}</p>}
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
            <label style={labelStyle}>Password</label>
            <div style={{position: "relative"}}>
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
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div> 

          {/* Confirm Password */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
            <label style={labelStyle}>Confirm Password</label>
            <div style={{position: "relative"}}>
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
            {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ marginRight: "8px", cursor: "pointer", accentColor: "#d4be82" }}
          />
          <label
            htmlFor="rememberMe"
            style={{ fontSize: "14px", color: "white", cursor: "pointer" }}
          >
            Remember me
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <button type="button" style={primaryButton} onClick={handleCreateAccount}>Create Account</button>
          <button type="button" style={googleButton} onClick={() => googleLogin()}>
            <FcGoogle size={22} style={{ marginRight: "6px" }} />
            Sign in with Google
          </button>
        </div>

        <p style={{ marginTop: "25px", fontSize: "14px", color: "#ccc" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#d4be82", textDecoration: "none", fontWeight: "bold" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
