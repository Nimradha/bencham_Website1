import React from 'react';

const Header = () => {
    const [searchTerm, setSearchTerm] = React.useState('');

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
        border : '1px solid #ccc',
        borderRadius: '4px',
        overflow: 'hidden',
        height: '30px',
        alignItems: 'center',
    };


    const inputStyle = {
        flex: 1,
        border: "none",
        padding: "0 10px",
        outline: "none",
        fontSize: "16px",
        height: "100%",
  };

    const buttonStyle = {
        
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 10px",
        cursor: "pointer",
        height: "100%",
    };

    const imgStyle = {
        height: "100%", 
        width: "auto",
    };

    const handleSearch = () => {
        alert(`Searching for: ${searchTerm}`);
    };


    return (
        <header style={headerStyle}>
            <div className='logo'>
                <img src="/images/logo1.png" alt="Logo" style={{ height: "200px" }} />
            </div>
            <nav>
                <ul className='nav-links' style={navLinksStyle}>
                    <li><a href="#home" style={testDeco}>Home</a></li>
                    <li><a href="#about" style={testDeco}>About</a></li>
                    <li><a href="#contact" style={testDeco}>Contact Us</a></li>
                    <li><a href="#login" style={testDeco}>Login</a></li>
                    <li><a href="#signup" style={testDeco}>SignUp</a></li>
                </ul>
            </nav>
            <div className='search-bar' style={searchBarStyle}>
                <input type="text" placeholder="Search" style={inputStyle} value={searchTerm} onChange={ (e) => setSearchTerm(e.target.value)}/>
                <button style={buttonStyle} onClick={handleSearch}><img src="/images/search.svg" alt="Search" style={imgStyle} /></button>
            </div>
            <div className='cart'>
                <img src="/images/cart.svg" alt="Cart" className="cart-img" style={{ width: "30px", height: "30px" }}/>
            </div>
        </header>
    );
};

export default Header;