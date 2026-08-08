import React from 'react';
import { FaSearch } from "react-icons/fa"; 
import { FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContext";


const Header = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
    const [userEmail, setUserEmail] = useState(sessionStorage.getItem("userEmail") || "");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const { cartItems } = useContext(CartContext);
    const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0) : 0;

    // Extract first name from email (e.g. "nimradha@gmail.com" → "NIMRADHA")
    const getFirstName = (email) => {
        if (!email) return "";
        const localPart = email.split("@")[0];            // "nimradha.silva"
        const first = localPart.split(/[._\-]/)[0];       // "nimradha"
        return first.toUpperCase();                        // "NIMRADHA"
    };
    const firstName = getFirstName(userEmail);

    // Keep login state in sync when token changes (e.g. after modal login)
    useEffect(() => {
        const checkLogin = () => {
            setIsLoggedIn(!!sessionStorage.getItem("token"));
            setUserEmail(sessionStorage.getItem("userEmail") || "");
        };
        window.addEventListener("storage", checkLogin);
        // Also poll every second to catch same-tab changes
        const interval = setInterval(checkLogin, 1000);
        return () => {
            window.removeEventListener("storage", checkLogin);
            clearInterval(interval);
        };
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        setUserEmail("");
        setShowDropdown(false);
        window.dispatchEvent(new Event("userChanged"));
        navigate("/");
    };

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

    const location = useLocation();

    // Sync searchTerm with URL query parameter
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const search = queryParams.get("search");
        if (search) {
            setSearchTerm(search);
        }
    }, [location.search]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/product?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate("/product");
        }
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
                    
                    {isLoggedIn ? (
                        <li style={{ position: "relative" }}>
                            {/* ── Account button ── */}
                            <button
                                onClick={() => setShowDropdown(prev => !prev)}
                                style={{
                                    background: "#ad9551",
                                    border: "2px solid #ad9551",
                                    color: "#27001a",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    padding: "8px 18px",
                                    borderRadius: "4px",
                                    letterSpacing: "0.6px",
                                    fontFamily: "inherit",
                                    whiteSpace: "nowrap",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <span style={{ fontSize: "16px" }}>👤</span>
                                {firstName ? firstName : "MY ACCOUNT"}
                                <span style={{ fontSize: "10px", marginLeft: "2px" }}>▼</span>
                            </button>

                            {/* ── Dropdown menu ── */}
                            {showDropdown && (
                                <>
                                {/* Click-outside overlay (invisible) */}
                                <div
                                    style={{ position: "fixed", inset: 0, zIndex: 999 }}
                                    onClick={() => setShowDropdown(false)}
                                />

                                <div style={{
                                    position: "absolute",
                                    top: "calc(100% + 14px)",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    background: "#27001a",
                                    border: "1px solid rgba(173,149,81,0.4)",
                                    borderRadius: "8px",
                                    width: "280px",
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                                    zIndex: 1000,
                                    overflow: "hidden",
                                }}>
                                    {/* Triangle pointer */}
                                    <div style={{
                                        position: "absolute",
                                        top: "-8px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: 0,
                                        height: 0,
                                        borderLeft: "9px solid transparent",
                                        borderRight: "9px solid transparent",
                                        borderBottom: "9px solid #27001a",
                                        filter: "drop-shadow(0 -2px 2px rgba(0,0,0,0.3))",
                                    }} />

                                    {/* Menu items */}
                                    {[
                                        { icon: "/images/smile.png",          label: "Manage My Account",          section: "profile" },
                                        { icon: "/images/orders.png",         label: "My Orders",                  section: "orders" },
                                        { icon: "/images/heart.png",          label: "My Wishlist & Followed Stores", section: "wishlist" },
                                        { icon: "/images/recommendation.png", label: "My Reviews",                 section: "reviews" },
                                        { icon: "/images/return.png",         label: "My Returns & Cancellations", section: "returns" },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "14px",
                                                padding: "13px 20px",
                                                cursor: "pointer",
                                                color: "white",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                                borderBottom: "1px solid rgba(255,255,255,0.08)",
                                                transition: "background 0.15s",
                                                fontFamily: "inherit",
                                                whiteSpace: "nowrap",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            onClick={() => {
                                                setShowDropdown(false);
                                                navigate("/manageAccount", { state: { section: item.section } });
                                            }}
                                        >
                                            <span style={{
                                                width: "34px",
                                                height: "34px",
                                                borderRadius: "50%",
                                                border: "1.5px solid rgba(255,255,255,0.2)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                background: "rgba(255,255,255,0.07)",
                                            }}>
                                                <img src={item.icon} alt="" style={{ width: "18px", height: "18px", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                                            </span>
                                            {item.label}
                                        </div>
                                    ))}

                                    {/* Logout */}
                                    <div
                                        onClick={handleLogout}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "14px",
                                            padding: "13px 20px",
                                            cursor: "pointer",
                                            color: "#ad9551",
                                            fontSize: "14px",
                                            fontWeight: "400",
                                            transition: "background 0.15s",
                                            fontFamily: "inherit",
                                            whiteSpace: "nowrap",
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <span style={{
                                            width: "34px",
                                            height: "34px",
                                            borderRadius: "50%",
                                            border: "1.5px solid rgba(255,255,255,0.15)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            background: "rgba(255,255,255,0.07)",
                                        }}>
                                            <img src="/images/logout.png" alt="" style={{ width: "18px", height: "18px", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                                        </span>
                                        Logout
                                    </div>
                                </div>
                                </>
                            )}
                        </li>
                    ) : (
                        <>
                            <li>
                                <NavLink to="/login" style={{ textDecoration: "none" }}>
                                    <button style={{
                                        background: "none",
                                        border: "2px solid #ad9551",
                                        color: "#ad9551",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        padding: "7px 20px",
                                        borderRadius: "4px",
                                        letterSpacing: "0.5px",
                                        fontFamily: "inherit",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = "#ad9551";
                                        e.currentTarget.style.color = "#27001a";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = "none";
                                        e.currentTarget.style.color = "#ad9551";
                                    }}
                                    >
                                        LOGIN
                                    </button>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/createAccount" style={{ textDecoration: "none" }}>
                                    <button style={{
                                        background: "#ad9551",
                                        border: "2px solid #ad9551",
                                        color: "#27001a",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        padding: "7px 20px",
                                        borderRadius: "4px",
                                        letterSpacing: "0.5px",
                                        fontFamily: "inherit",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = "#c9a84c";
                                        e.currentTarget.style.borderColor = "#c9a84c";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = "#ad9551";
                                        e.currentTarget.style.borderColor = "#ad9551";
                                    }}
                                    >
                                        SIGN UP
                                    </button>
                                </NavLink>
                            </li>
                        </>
                    )}
                    
                </ul>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <form className='search-bar' style={searchBarStyle} onSubmit={handleSearch}>
                    <input type="text" placeholder="Search jewelry..." style={inputStyle} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button type="submit" style={buttonStyle}><FaSearch size={20} color="#cdaf5b" /></button>
                </form>
               <div className='cart' style={{ cursor: "pointer", position: "relative" }} onClick={handleCartClick}>
                <img src="/images/shopping-cart-01-svgrepo-com (1).svg" style={{height:"35px"}} alt="Cart" />
                {isLoggedIn && cartCount > 0 && (
                    <span style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-10px",
                        backgroundColor: "white",
                        color: "#e65100",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
                    }}>
                        {cartCount}
                    </span>
                )}
               </div>
            </div>

        </header>
    );
};

export default Header;