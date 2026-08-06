export const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://bencham-api.vercel.app"
    : "http://localhost:3000");
