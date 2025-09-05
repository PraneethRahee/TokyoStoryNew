import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
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
import Raffle from './pages/Raffle';
import PaymentHistory from './pages/PaymentHistory';
import './index.css';

function App() {
  return (
    <Sentry.ErrorBoundary fallback={({ error, resetError }) => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button
            onClick={resetError}
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Try again
          </button>
        </div>
      </div>
    )}>
      <AuthProvider>
        <PurchaseProvider>
          <CartProvider>
            <Router>
              <div className="App">
                <a 
                  href="#main-content" 
                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-pink-500 text-white px-4 py-2 rounded-lg z-50"
                >
                  Skip to main content
                </a>
                <Navbar />
                <main id="main-content">
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
                  <Route path="/raffle" element={
                    <ProtectedRoute>
                      <Raffle />
                    </ProtectedRoute>
                  } />
                  <Route path="/payments" element={
                    <ProtectedRoute>
                      <PaymentHistory />
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
    </Sentry.ErrorBoundary>
  );
}

export default App;
