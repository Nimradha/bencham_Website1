import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

/**
 * LoginModal
 * Props:
 *   onClose()        — called when user closes/cancels the modal
 *   onLoginSuccess() — called after a successful login (so the parent can retry the action)
 */
const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── Email / Password login ──────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email);
        window.dispatchEvent(new Event("userChanged"));
        onLoginSuccess();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google login ────────────────────────────────────────────────────────────
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("http://localhost:3000/api/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userEmail", data.email);
          window.dispatchEvent(new Event("userChanged"));
          onLoginSuccess();
        } else {
          alert(data.message || "Google login failed");
        }
      } catch (err) {
        console.error(err);
        alert("Google login failed. Please try again.");
      }
    },
    onError: () => {
      alert("Google sign-in failed. Please try again.");
    },
  });

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const backdrop = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    zIndex: 9000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    animation: "fadeIn 0.2s ease",
  };

  const modal = {
    backgroundColor: "#1a000f",
    border: "1px solid rgba(173,149,81,0.6)",
    borderRadius: "12px",
    width: "440px",
    maxWidth: "95vw",
    overflow: "hidden",
    boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
    animation: "slideUp 0.25s ease",
    fontFamily: "'Inter', sans-serif",
  };

  const header = {
    position: "relative",
    height: "160px",
    overflow: "hidden",
  };

  const headerImg = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const headerOverlay = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(88,65,65,0.2) 30%, rgba(39,0,26,0.92) 100%)",
  };

  const headerText = {
    position: "absolute",
    bottom: "18px",
    left: "24px",
    color: "white",
    zIndex: 2,
  };

  const closeBtn = {
    position: "absolute",
    top: "14px",
    right: "16px",
    background: "rgba(0,0,0,0.45)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    fontSize: "18px",
    lineHeight: "30px",
    textAlign: "center",
    cursor: "pointer",
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const body = {
    padding: "28px 32px 32px",
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    marginBottom: "14px",
    border: "1px solid rgba(173,149,81,0.5)",
    borderRadius: "6px",
    boxSizing: "border-box",
    backgroundColor: "#0d0008",
    color: "white",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    textAlign: "left",
    marginBottom: "6px",
    fontWeight: "500",
    fontSize: "13px",
    color: "rgba(255,255,255,0.75)",
  };

  const primaryBtn = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#d4be82",
    color: "#1a000f",
    border: "none",
    borderRadius: "7px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "12px",
    letterSpacing: "0.3px",
  };

  const googleBtn = {
    width: "100%",
    padding: "11px",
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid rgba(173,149,81,0.5)",
    borderRadius: "7px",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  };

  const divider = {
    textAlign: "center",
    color: "rgba(255,255,255,0.35)",
    fontSize: "12px",
    margin: "14px 0",
    position: "relative",
  };

  return (
    <>
      {/* Inject keyframe animations */}
      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div style={backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div style={modal}>
          {/* ── Header image ── */}
          <div style={header}>
            <img src="/images/pendant.png" alt="pendant" style={headerImg} />
            <div style={headerOverlay} />
            <div style={headerText}>
              <h2 style={{ margin: 0, fontSize: "22px" }}>Welcome Back</h2>
              <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
                Sign in to continue
              </p>
            </div>
            <button style={closeBtn} onClick={onClose} aria-label="Close login modal">
              ✕
            </button>
          </div>

          {/* ── Form body ── */}
          <div style={body}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="name@bencham.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
            />

            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
            />

            <div style={{ textAlign: "right", marginBottom: "18px" }}>
              <span
                style={{ color: "#ad9551", fontSize: "13px", cursor: "pointer" }}
                onClick={() => { onClose(); navigate("/forgotPassword"); }}
              >
                Forgot password?
              </span>
            </div>

            <button style={primaryBtn} onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </button>

            <div style={divider}>─── or ───</div>

            <button style={googleBtn} onClick={() => googleLogin()}>
              <FcGoogle size={20} />
              Sign in with Google
            </button>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              Don't have an account?{" "}
              <span
                style={{ color: "#ad9551", cursor: "pointer" }}
                onClick={() => { onClose(); navigate("/createAccount"); }}
              >
                Create Account
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
