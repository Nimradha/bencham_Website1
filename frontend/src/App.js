
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import Home from './components/Home';
import Contact from './components/Contact';

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

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
    <Router>
      <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      
      <Footer />

      {showSplash && (
        <div style={splashOverlay}>
          <img src="/images/pendant2.gif" alt="butterfly" style={splashImage} />
        </div>
      )}
      </div>

    </Router>
    
  );
}

export default App;

