import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MarketplaceHome from './pages/MarketplaceHome';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MarketplaceHome />} />
        <Route path="/checkout/:orderId" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;