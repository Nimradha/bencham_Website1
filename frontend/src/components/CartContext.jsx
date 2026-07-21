import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

// Returns a user-specific localStorage key, e.g. "cart_alice@gmail.com"
// Falls back to "cart_guest" when no user is logged in.
const getCartKey = () => {
  const email = localStorage.getItem("userEmail");
  return email ? `cart_${email}` : "cart_guest";
};

export const CartProvider = ({ children }) => {

  // Load initial cart from the current user's key
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(getCartKey());
    return saved ? JSON.parse(saved) : [];
  });

  // Re-load the cart whenever the logged-in user changes (e.g. after login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem(getCartKey());
      setCartItems(saved ? JSON.parse(saved) : []);
    };
    // Listen for login/logout events dispatched by Login/Header components
    window.addEventListener("userChanged", handleStorageChange);
    return () => window.removeEventListener("userChanged", handleStorageChange);
  }, []);

  // Persist cart to the current user's key on every change
  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
  }, [cartItems]);

  // Optionally sync from backend on mount (kept from original)
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/api/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };
    fetchCart();
  }, []);

  const addToCart = (item) => {
    const exist = cartItems.find(ci => ci.id === item.id);
    if (exist) {
      setCartItems(cartItems.map(ci =>
        ci.id === item.id ? { ...ci, quantity: ci.quantity + item.quantity } : ci
      ));
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(ci => ci.id !== id));
  };

  const increaseQty = (id) => {
    setCartItems(cartItems.map(ci =>
      ci.id === id ? { ...ci, quantity: ci.quantity + 1 } : ci
    ));
  };

  const decreaseQty = (id) => {
    setCartItems(cartItems.map(ci =>
      ci.id === id && ci.quantity > 1 ? { ...ci, quantity: ci.quantity - 1 } : ci
    ));
  };

  // Clear only the current user's cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(getCartKey());
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
