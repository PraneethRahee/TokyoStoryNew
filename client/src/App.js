import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { PurchaseProvider } from './context/PurchaseContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PaymentWidget from './components/PaymentWidget';
import Home from './pages/Home';
import Stories from './pages/Stories';
import StoryDetail from './pages/StoryDetail';
import Submit from './pages/Submit';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PurchasedStories from './pages/PurchasedStories';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancelled from './pages/PaymentCancelled';
import './index.css';

function App() {
  return (
    <PurchaseProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/story/:id" element={<StoryDetail />} />
                <Route path="/submit" element={<Submit />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/purchased" element={<PurchasedStories />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-cancelled" element={<PaymentCancelled />} />
              </Routes>
            </main>
            <Footer />
            <PaymentWidget />
          </div>
        </Router>
      </CartProvider>
    </PurchaseProvider>
  );
}

export default App;
