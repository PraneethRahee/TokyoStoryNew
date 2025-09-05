import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { paymentsAPI, authAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { usePurchase } from '../context/PurchaseContext';
import { useAuth } from '../context/AuthContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { addPurchase } = usePurchase();
  const { user, isAuthenticated } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const sessionId = searchParams.get('session_id');
  const processedSessions = useRef(new Set()); // Track processed sessions

  // Clear cart on successful payment and add purchases (client state)
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('tokyoLoreCart') || '[]');
    if (cartItems.length > 0) {
      addPurchase(cartItems);
    }
    clearCart();
  }, [clearCart, addPurchase]);

  // Fetch session and persist to DB based on metadata
  // Note: We intentionally use user?._id instead of user to prevent infinite loops
  // when the user object reference changes but the ID remains the same
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const persistPurchase = async () => {
      if (!sessionId || !isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      // Prevent processing the same session multiple times
      if (processedSessions.current.has(sessionId)) {
        setLoading(false);
        return;
      }
      try {
        // Mark session as being processed
        processedSessions.current.add(sessionId);
        
        const s = await paymentsAPI.getSession(sessionId);
        setSession(s);

        // If raffle purchase, record raffle entries
        if (s?.metadata?.type === 'raffle' && s?.metadata?.tickets) {
          try {
            await authAPI.recordRaffleEntry({
              tickets: Number(s.metadata.tickets),
              amount: s.amount_total,
              sessionId
            });
          } catch (e) {
            console.error('Failed to record raffle entry:', e);
          }
        }

        // If cart checkout, record purchase + purchased stories
        if (s?.metadata?.type === 'cart_checkout') {
          let cartItems = [];

          // Prefer server-side snapshot if present
          if (s.metadata?.snapshotKey) {
            try {
              const token = localStorage.getItem('token');
              const headers = token ? { Authorization: `Bearer ${token}` } : {};
              const resp = await fetch(`/api/payments/snapshot/${s.metadata.snapshotKey}`, { headers });
              if (resp.ok) {
                const data = await resp.json();
                cartItems = data.items || [];
              }
            } catch (e) {
              console.warn('Failed to fetch server snapshot, will use local fallback');
            }
          }

          // Fallback to local snapshot
          if (!Array.isArray(cartItems) || cartItems.length === 0) {
            cartItems = JSON.parse(localStorage.getItem('tokyoLoreCartSnapshot') || '[]');
          }

          if (Array.isArray(cartItems) && cartItems.length > 0) {
            // Record purchase history
            try {
              const itemsPayload = cartItems.map(ci => ({
                storyId: ci.id || ci.storyId,
                title: ci.title,
                price: Math.round((ci.price || 0) * 100), // in cents
                quantity: ci.quantity || 1
              }));
              await authAPI.recordPurchase({
                items: itemsPayload,
                amount: s.amount_total,
                sessionId
              });
            } catch (e) {
              console.error('Failed to record purchase history:', e);
            }

            // Add purchased stories to user's purchasedStories
            try {
              const storyIds = cartItems
                .map(ci => ci.id || ci.storyId)
                .filter(Boolean);
              if (storyIds.length > 0) {
                await authAPI.purchaseStories(storyIds);
              }
            } catch (e) {
              console.error('Failed to add purchased stories:', e);
            }
          }
        }
      } catch (e) {
        setError('Failed to load payment details. Your payment was successful, but we could not retrieve the details.');
      } finally {
        setLoading(false);
      }
    };

    persistPurchase();
  }, [sessionId, isAuthenticated, user?._id]); // ✅ Use user._id to prevent unnecessary re-runs

  // Keep a snapshot of cart before redirect (should be set on checkout trigger)
  // You can set this snapshot in your checkout flow when creating the session

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      navigate('/', { replace: true });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 py-12"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        paddingTop: '3rem',
        paddingBottom: '3rem'
      }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="bg-white rounded-xl shadow-lg p-8 text-center"
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            textAlign: 'center'
          }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          
          <h1 
            className="text-3xl font-bold text-gray-900 mb-4"
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}
          >
            Payment Successful!
          </h1>
          
          <p 
            className="text-lg text-gray-600 mb-6"
            style={{
              fontSize: '1.125rem',
              color: '#4b5563',
              marginBottom: '1.5rem'
            }}
          >
            Thank you for your purchase! Your stories have been added to your library.
          </p>

          {/* Countdown Timer */}
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-6 text-white"
            style={{
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              color: 'white'
            }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <Clock className="w-6 h-6" />
                <span className="text-lg font-medium">Redirecting to Home in:</span>
              </div>
              <div 
                className="text-4xl font-bold mb-3"
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 'bold',
                  marginBottom: '0.75rem'
                }}
              >
                {formatTime(timeLeft)}
              </div>
              
              {/* Progress Bar */}
              <div 
                className="w-full bg-blue-400 rounded-full h-2 mb-3"
                style={{
                  width: '100%',
                  backgroundColor: '#60a5fa',
                  borderRadius: '9999px',
                  height: '0.5rem',
                  marginBottom: '0.75rem'
                }}
              >
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ 
                    width: `${(timeLeft / 30) * 100}%`,
                    backgroundColor: 'white',
                    height: '0.5rem',
                    borderRadius: '9999px',
                    transition: 'all 1s ease-linear'
                  }}
                ></div>
              </div>
              
              <p 
                className="text-blue-100 text-sm"
                style={{
                  color: '#dbeafe',
                  fontSize: '0.875rem'
                }}
              >
                You'll be automatically redirected to the home page. You can also click the button below to go there now.
              </p>
            </div>
          </div>

          {error && (
            <div 
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center"
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}
            >
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {session && (
            <div 
              className="bg-gray-50 rounded-lg p-6 mb-6 text-left"
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}
            >
              <h3 className="font-semibold text-gray-900 mb-3">Payment Details:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${(session.amount_total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span>{session.currency?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="text-green-600 font-medium">{session.payment_status}</span>
                </div>
                {session.metadata?.tickets && (
                  <div className="flex justify-between">
                    <span>Tickets Purchased:</span>
                    <span>{session.metadata.tickets}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Home Page
              </Link>
              
              <Link
                to="/purchased"
                className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                View My Stories
              </Link>
            </div>
            
            <div className="text-sm text-gray-500">
              A confirmation email has been sent to your email address.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
