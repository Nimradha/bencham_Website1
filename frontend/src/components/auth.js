export const isLoggedIn = () => {
  const token = sessionStorage.getItem("token");
  return token !== null;
};