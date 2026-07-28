import React, { createContext, useState, useEffect, useRef } from "react";

export const CartContext = createContext();

// Returns a user-specific localStorage key, e.g. "cart_alice@gmail.com"
// Falls back to "cart_guest" when no user is logged in.
const getCartKey = () => {
  const email = sessionStorage.getItem("userEmail");
  return email ? `cart_${email}` : "cart_guest";
};

export const CartProvider = ({ children }) => {
  // Track the current cart key so we know when the user changes
  const currentKeyRef = useRef(getCartKey());

  // Load initial cart from the current user's key
  const [cartItems, setCartItems] = useState(() => {
    const key = getCartKey();
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  // Re-load the cart whenever the logged-in user changes (e.g. after login/logout)
  useEffect(() => {
    const handleUserChanged = () => {
      const newKey = getCartKey();
      currentKeyRef.current = newKey;
      const saved = localStorage.getItem(newKey);
      setCartItems(saved ? JSON.parse(saved) : []);
    };
    // Listen for login/logout events dispatched by Login/Header components
    window.addEventListener("userChanged", handleUserChanged);
    return () => window.removeEventListener("userChanged", handleUserChanged);
  }, []);

  // Persist cart to the CURRENT user's key on every change
  // Uses currentKeyRef so it always writes to the right user even during
  // rapid state transitions (e.g. login → addToCart in same tick)
  useEffect(() => {
    const key = currentKeyRef.current;
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems]);

  // addToCart: always reads from localStorage for the CURRENT user's key.
  // This avoids stale React state when addToCart is called immediately after
  // login (e.g. via the login modal on the product page), where React state
  // hasn't re-rendered yet with the new user's empty cart.
  const addToCart = (item) => {
    const key = getCartKey();
    currentKeyRef.current = key; // ensure ref is in sync
    const saved = localStorage.getItem(key);
    const currentItems = saved ? JSON.parse(saved) : [];

    const exist = currentItems.find(ci => ci.id === item.id);
    let updatedItems;
    if (exist) {
      updatedItems = currentItems.map(ci =>
        ci.id === item.id ? { ...ci, quantity: ci.quantity + item.quantity } : ci
      );
    } else {
      updatedItems = [...currentItems, item];
    }
    setCartItems(updatedItems);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(ci => ci.id !== id));
  };

  const increaseQty = (id) => {
    setCartItems(prev => prev.map(ci =>
      ci.id === id ? { ...ci, quantity: ci.quantity + 1 } : ci
    ));
  };

  const decreaseQty = (id) => {
    setCartItems(prev => prev.map(ci =>
      ci.id === id && ci.quantity > 1 ? { ...ci, quantity: ci.quantity - 1 } : ci
    ));
  };

  // Remove selected items from current user's cart
  const removeSelectedItems = (idsToRemove) => {
    if (!idsToRemove || idsToRemove.length === 0) return;
    setCartItems(prev => prev.filter(item => !idsToRemove.includes(item.id)));
  };

  // Clear only the current user's cart
  const clearCart = () => {
    const key = getCartKey();
    localStorage.removeItem(key);
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart, removeSelectedItems }}>
      {children}
    </CartContext.Provider>
  );
};
