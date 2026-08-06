const rawUrl = process.env.REACT_APP_API_URL || 
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? ""
    : "http://localhost:3000");

export const API_BASE_URL = rawUrl.replace(/\/+$/, "");
