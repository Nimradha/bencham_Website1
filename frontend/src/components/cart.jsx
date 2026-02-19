import React, { useContext, useState} from "react";
import { CartContext } from "./CartContext";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";


const Cart = () => {

  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty
  } = useContext(CartContext);

  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const handleCheckout = () => {
  
   const selectedProducts = cartItems.filter(item =>
    selectedItems.includes(item.id)
   );

   if (selectedProducts.length === 0) {
    alert("Please select at least one item");
    return;
   }

  
  navigate("/buy", { state: selectedProducts[0] });
};


  const subtotal = cartItems
  .filter(item => selectedItems.includes(item.id))
  .reduce((total, item) => total + item.price * item.quantity, 0);

  
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
        <h2>My Cart</h2>

       {cartItems.map((item) => (
       <div key={item.id} className="cart-row">

      
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
        <p style={{color:"#27001a"}}>Rs. {item.price* item.quantity}</p>

        <div className="qty-box">
          <button onClick={() => decreaseQty(item.id)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => increaseQty(item.id)}>+</button>
        </div>

        
          <img src="/images/delete-svgrepo-com.svg" alt="Delete" style={{width:"20px",cursor:"pointer"}} onClick={() => removeFromCart(item.id)}/>
        
      </div>

    </div>
  ))}
</div>


      <div className="summary-card">
        <h3>Order Summary</h3>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>Rs. {subtotal}</span>
        </div>

        <div className="summary-row total">
          <span>Total</span>
          <span>Rs. {subtotal}</span>
        </div>

        <button className="proceed" onClick={handleCheckout}>
          PROCEED TO CHECKOUT ({cartItems.length})
        </button>
      </div>

    </div>
  );
};

export default Cart;
