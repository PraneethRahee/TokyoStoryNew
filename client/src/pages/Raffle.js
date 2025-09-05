import React, { useState } from 'react';
import { CreditCard, Minus, Plus, Ticket, Sparkles, CheckCircle } from 'lucide-react';
import { paymentsAPI } from '../utils/api';

const Raffle = () => {
  const [ticketCount, setTicketCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const PRICE_PER_TICKET_USD = 5;

  const handleTicketChange = (increment) => {
    const next = ticketCount + increment;
    if (next >= 1 && next <= 10) setTicketCount(next);
  };

  const handleCheckout = async () => {
    try {
      setError(null);
      setSuccess(null);
      setIsLoading(true);

      const response = await paymentsAPI.createCheckoutSession({
        amount: ticketCount * PRICE_PER_TICKET_USD * 100,
        currency: 'usd',
        metadata: {
          type: 'raffle',
          tickets: String(ticketCount)
        }
      });

      window.location.href = response.checkoutUrl;
    } catch (e) {
      setError('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-pink-200 to-indigo-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-4">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Monthly Raffle</h1>
          <p className="text-gray-600 mt-2">Buy tickets to join the raffle and win exclusive Tokyo Lore rewards.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose Tickets</h2>
            <p className="text-gray-600 text-sm">You can buy between 1 and 10 tickets per checkout.</p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg disabled:opacity-50"
              onClick={() => handleTicketChange(-1)}
              disabled={ticketCount <= 1 || isLoading}
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-2xl font-bold text-gray-900 w-20 text-center">{ticketCount}</div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg disabled:opacity-50"
              onClick={() => handleTicketChange(1)}
              disabled={ticketCount >= 10 || isLoading}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Price per ticket</div>
              <div className="text-lg font-semibold text-gray-900">${PRICE_PER_TICKET_USD.toFixed(2)}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-lg font-semibold text-gray-900">${(ticketCount * PRICE_PER_TICKET_USD).toFixed(2)}</div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">{error}</div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {success}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ${ (ticketCount * PRICE_PER_TICKET_USD).toFixed(2) }
              </>
            )}
          </button>

          <div className="mt-6 text-sm text-gray-500 flex items-center gap-2 justify-center">
            <Sparkles className="w-4 h-4" /> Every ticket increases your chances to win.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Raffle;
