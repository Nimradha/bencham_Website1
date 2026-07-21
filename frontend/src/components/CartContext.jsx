import React, { createContext, useState,useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(() => { 
    const savedCart = localStorage.getItem("cart"); 
    return savedCart ? JSON.parse(savedCart) : []; 
  });

 useEffect(() => { 
  localStorage.setItem("cart", JSON.stringify(cartItems));
 }, [cartItems]);


  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // no user logged in

      try {
        const res = await fetch("http://localhost:3000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
        ci.id === item.id
         ? { ...ci, quantity: ci.quantity + item.quantity } 
         : ci
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
    ci.id === id && ci.quantity > 1
      ? { ...ci, quantity: ci.quantity - 1 }
      : ci
  ));
};

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
