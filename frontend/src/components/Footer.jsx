import React from 'react';

const Footer = () => {

    const footerStyle = {
        padding: '1rem',
        textAlign: 'center',
        background: '#f5f5f5',
        position: 'fixed',
        bottom: '0',
        width: '100%',
        left: '0',
    };
    return (
        <footer style={footerStyle}>
            <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </footer>
    );
};

export default Footer;