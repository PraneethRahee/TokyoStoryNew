import React, { useState } from 'react';
import { CreditCard, Minus, Plus } from 'lucide-react';
import { paymentsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PaymentWidget = () => {
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [ticketCount, setTicketCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [userTickets, setUserTickets] = useState(56); // Mock data

  const handleTicketChange = (increment) => {
    const newCount = ticketCount + increment;
    if (newCount >= 1 && newCount <= 10) {
      setTicketCount(newCount);
    }
  };

  const handleJoinRaffle = async () => {
    setIsLoading(true);
    try {
      const response = await paymentsAPI.createCheckoutSession({
        amount: ticketCount * 500, // $5 per ticket
        currency: 'usd',
        metadata: {
          type: 'raffle',
          tickets: ticketCount.toString(),
          userTickets: userTickets.toString()
        }
      });
      
      // Redirect to Stripe Checkout using the single URL
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await paymentsAPI.createCheckoutSession({
        amount: ticketCount * 500, // $5 per ticket
        currency: 'usd',
        metadata: {
          type: 'payment',
          tickets: ticketCount.toString()
        }
      });
      
      // Redirect to Stripe Checkout using the single URL
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the widget if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Floating Payment Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Main Widget Panel */}
        {isExpanded && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4 w-80 border border-gray-200">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                You have {userTickets} tickets.
              </h3>
            </div>

            {/* Tickets to Buy Section */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Tickets to Buy:
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleTicketChange(-1)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 transition-colors duration-200"
                  disabled={ticketCount <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  className="flex-1 text-center py-2 px-4 border-0 focus:outline-none focus:ring-0"
                  min="1"
                  max="10"
                />
                <button
                  onClick={() => handleTicketChange(1)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 transition-colors duration-200"
                  disabled={ticketCount >= 10}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleJoinRaffle}
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Join the Raffle'}
              </button>
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        )}

        {/* Floating Icon Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="Payment options"
        >
          <CreditCard className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default PaymentWidget;
