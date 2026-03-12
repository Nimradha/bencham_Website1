import React from 'react';
import { FaSearch } from "react-icons/fa"; 
import { FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const Header = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const navigate = useNavigate();


    const headerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 25px",
        backgroundColor: "#27001a",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        height: "135px",
    };

    const navLinksStyle = {
        listStyle: "none",
        display: "flex",
        gap: "80px",
        fontSize: "16px",
    };

    const testDeco = {
        textDecoration: "none",
        color: "white",
    };

    const searchBarStyle = {
        display: 'flex',
        border: '1px solid rgba(173, 149, 81, 0.6)',
        borderRadius: '4px',
        overflow: 'hidden',
        height: '30px',
        alignItems: 'center',
    };
    const handleCartClick = () => {
      navigate("/cart");
    };




    const inputStyle = {
        flex: 1,
        border: "none",
        padding: "0 10px",
        outline: "none",
        fontSize: "16px",
        height: "100%",
        backgroundColor: "#27001a",
        color: "white",
  };

    const buttonStyle = {
        
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 10px",
        cursor: "pointer",
        height: "100%",
        backgroundColor: "#27001a",
    };

    const imgStyle = {
        height: "100%", 
        width: "auto",
    };

    const handleSearch = () => {
        alert(`Searching for: ${searchTerm}`);
    };
    const navLinkStyle = ({ isActive }) => ({
       textDecoration: isActive ? "underline" : "none",
       textUnderlineOffset: "6px",
       color: isActive ? "#ad9551" : "white",
});


    return (
        <header style={headerStyle}>
            <div className='logo'>
                <img src="/images/logo1.png" alt="Logo" style={{ height: "200px" }} />
            </div>
            <nav>
                <ul className='nav-links' style={navLinksStyle}>
                    <li><NavLink to="/" style={navLinkStyle} >Home</NavLink></li>

                    <li><NavLink to="/product" style={navLinkStyle} >Products</NavLink></li>

                    <li><NavLink to="/about" style={navLinkStyle} >About Us</NavLink></li>

                    <li><NavLink to="/contact" style={navLinkStyle} >Contact Us</NavLink></li>
                    
                    <li><NavLink to="/login" style={navLinkStyle} >Login</NavLink></li>
                    
                </ul>
            </nav>
            <div className='search-bar' style={searchBarStyle}>
                <input type="text" placeholder="Search" style={inputStyle} value={searchTerm} onChange={ (e) => setSearchTerm(e.target.value)}/>
                <button style={buttonStyle} onClick={handleSearch}><FaSearch size={20} color="#cdaf5b" /></button>
            </div>
           <div className='cart' style={{ cursor: "pointer" }} onClick={handleCartClick}>
            <img src="/images/shopping-cart-01-svgrepo-com (1).svg" style={{height:"35px"}} alt="Cart" />
           </div>

        </header>
    );
};

export default Header;