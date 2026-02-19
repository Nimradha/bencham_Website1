
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import Home from './components/Home';
import Contact from './components/Contact';
import About from './components/About';
import Login from './components/Login';
import CreateAccount from './components/createAccount';
import ForgotPassword from './components/forgotPassword';
import VerifyOtp from './components/verifyOtp';
import ResetPassword from './components/resetPassword';
import Details from './components/Details';
import Buy from './components/buy';
import Cart from './components/cart';
import { CartProvider } from './components/CartContext';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const ProtectedRoute = ({ children }) => {
    const isLoggedIn = sessionStorage.getItem("user") !== null;

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const splashOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.6)", // translucent white
    backdropFilter: "blur(8px)", // blur effect
    zIndex: 9999
  };

  const splashImage = {
    width: "200px",
    height: "200px",
  };

  return (
    <CartProvider>
    <Router>
      <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/verifyOtp" element={<VerifyOtp />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/buy" element={<Buy />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
      </Routes>
      
      <Footer />

      {showSplash && (
        <div style={splashOverlay}>
          <img src="/images/pendant2.gif" alt="butterfly" style={splashImage} />
        </div>
      )}
      </div>

    </Router>
    </CartProvider>
    
  );
}

export default App;

