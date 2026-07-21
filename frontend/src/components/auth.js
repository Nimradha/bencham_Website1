export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  const user = sessionStorage.getItem("user"); 
  return token !== null || user !== null;
};