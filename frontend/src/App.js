
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate ,useLocation} from 'react-router-dom';
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
import Product from './components/Product';
import ManageAccount from './components/ManageAccount';
import OrderSuccess from './components/OrderSuccess';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import { CartProvider } from './components/CartContext';
import { validateSession } from './components/auth';
import './App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  // Validate the stored JWT on every app startup.
  // If the token is expired or belongs to a previous session, clear it so
  // the user is treated as a guest — preventing them from seeing another
  // user's cart or account data.
  React.useEffect(() => {
    validateSession();
  }, []);

  const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");
    const location = useLocation();

    if (!token) {
      return <Navigate to="/login" state={{ from: location }} replace />;
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
      <ScrollToTop />
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
        <Route 
        path="/buy"
         element={
            <ProtectedRoute>
              <Buy />
            </ProtectedRoute>
          } 
        />
        <Route path="/product" element={<Product />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route
          path="/manageAccount"
          element={
            <ProtectedRoute>
              <ManageAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
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

