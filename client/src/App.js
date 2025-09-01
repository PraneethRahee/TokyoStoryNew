import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { PurchaseProvider } from './context/PurchaseContext';
import { AuthProvider } from './context/AuthContext';
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
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <PurchaseProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/stories" element={
                    <ProtectedRoute>
                      <Stories />
                    </ProtectedRoute>
                  } />
                  <Route path="/story/:id" element={
                    <ProtectedRoute>
                      <StoryDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/submit" element={
                    <ProtectedRoute>
                      <Submit />
                    </ProtectedRoute>
                  } />
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/purchased" element={
                    <ProtectedRoute>
                      <PurchasedStories />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
              <PaymentWidget />
            </div>
          </Router>
        </CartProvider>
      </PurchaseProvider>
    </AuthProvider>
  );
}

export default App;
