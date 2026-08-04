import { API_BASE_URL } from "../config";

export const isLoggedIn = () => {
  const token = sessionStorage.getItem("token");
  return token !== null;
};

/**
 * Validates the stored JWT with the backend.
 * If it's invalid/expired, clears sessionStorage so the user is treated as a guest.
 * Call this once when the app mounts (e.g. in App.js useEffect).
 */
export const validateSession = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) return; // no session to validate

  try {
    const res = await fetch(`${API_BASE_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      // Token expired or invalid — clear the stale session
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userEmail");
      window.dispatchEvent(new Event("userChanged"));
    }
  } catch (err) {
    // Network error — don't clear session (user might be offline)
    console.warn("Session validation skipped (network error):", err.message);
  }
};