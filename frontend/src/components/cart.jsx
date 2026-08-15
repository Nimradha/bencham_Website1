import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "./auth";
import { parsePrice } from "./Details";

const Cart = () => {

  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty
  } = useContext(CartContext);

  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
  if (!isLoggedIn()) {
    navigate("/login");
  }
}, []);

  const handleCheckout = () => {
    const selectedProducts = cartItems.filter(item =>
      selectedItems.includes(item.id)
    );

    if (selectedProducts.length === 0) {
      alert("Please select at least one item");
      return;
    }

    navigate("/buy", {
      state: {
        items: selectedProducts,
        selectedIds: selectedItems,
        fromCart: true
      }
    });
  };


  const subtotal = cartItems
  .filter(item => selectedItems.includes(item.id))
  .reduce((total, item) => total + parsePrice(item.price) * item.quantity, 0);

  
  const handleSelect = (id) => {
   if (selectedItems.includes(id)) {
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  } else {
    setSelectedItems([...selectedItems, id]);
  }
};


  if (cartItems.length === 0) {
    return <h2>Your cart is empty</h2>;
  }

  return (
    <div className="checkout-container">

      <div className="card">
        <h3 style={{color:"white",fontFamily:"'Montserrat', sans-serif"}}>My Cart</h3>

       {cartItems.map((item) => (
       <div key={item.id} className="cart-row" style={{color:"#b9c7de"}}>

      
         <div className="cart-left">
            <input
               type="checkbox"
               checked={selectedItems.includes(item.id)}
               onChange={() => handleSelect(item.id)}
            />
            <img
            src={item.image}
            alt={item.title}
            style={{
               width: "60px",
               height: "70px",
               objectFit: "cover",
               borderRadius: "8px"
            }}
             />

            <div>
                <p style={{fontFamily:"'Montserrat', sans-serif"}}>{item.title}</p>
           </div>
         </div>

      {/* RIGHT SIDE */}
      <div className="cart-right">
        <p style={{color:"white"}}>Rs. {item.price* item.quantity}</p>

        <div className="qty-box">
          <button onClick={() => decreaseQty(item.id)} style={{backgroundColor:"#ad9551",borderRadius:"10%"}}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => increaseQty(item.id)} style={{backgroundColor:"#ad9551",borderRadius:"10%"}}>+</button>
        </div>

        
          <MdDelete size={20} style={{cursor:"pointer",color:"#b9c7de"}} onClick={() => removeFromCart(item.id)}/>
        
      </div>

    </div>
  ))}
</div>


      <div className="summary-card">
        <h3 style={{color:"white",fontFamily:"'Montserrat', sans-serif",fontStyle:"italic"}}>Order Summary</h3>

        <div className="summary-row">
          <span style={{color:"#b9c7de"}}>Subtotal</span>
          <span style={{color:"white"}}>Rs. {subtotal}</span>
        </div>

        <div className="summary-row total">
          <span style={{color:"#b9c7de"}}>Total</span>
          <span style={{color:"white"}}>Rs. {subtotal}</span>
        </div>

        <button className="proceed" onClick={handleCheckout} style={{color:"black",borderRadius:"5px"}}>
          PROCEED TO CHECKOUT ({selectedItems.length})
        </button>
      </div>

    </div>
  );
};

export default Cart;
