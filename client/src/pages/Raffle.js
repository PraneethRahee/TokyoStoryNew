import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Gift, Ticket, Star, Users } from 'lucide-react';

const Raffle = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(1);
  const [userTickets, setUserTickets] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserTickets(user.raffleEntries || 0);
    }
  }, [user]);

  const handleTicketChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      setTickets(value);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: 'raffle',
          tickets: tickets,
          amount: tickets * 500 // $5 per ticket
        })
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error purchasing tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <Gift className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tokyo Story Raffle</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter our monthly raffle for a chance to win exclusive Tokyo experiences and prizes!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Prize Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">This Month's Prizes</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                <Star className="w-8 h-8 text-yellow-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">1st Place</h3>
                  <p className="text-gray-600">Exclusive Tokyo food tour for 2</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Star className="w-8 h-8 text-gray-400 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">2nd Place</h3>
                  <p className="text-gray-600">$200 Tokyo shopping voucher</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                <Star className="w-8 h-8 text-orange-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">3rd Place</h3>
                  <p className="text-gray-600">Premium Tokyo story collection</p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Tickets */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase Tickets</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tickets
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={tickets}
                onChange={handleTicketChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <p className="text-sm text-gray-500 mt-1">$5 per ticket (max 10 tickets)</p>
            </div>

            <div className="mb-6 p-4 bg-pink-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">Total Cost:</span>
                <span className="text-2xl font-bold text-pink-600">
                  ${(tickets * 5).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Ticket className="w-5 h-5 mr-2" />
                  Purchase {tickets} Ticket{tickets > 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Raffle Stats</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{userTickets}</h3>
              <p className="text-gray-600">Total Tickets</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">1,247</h3>
              <p className="text-gray-600">Total Participants</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">3</h3>
              <p className="text-gray-600">Prizes Available</p>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Raffle Rules</h2>
          <div className="prose prose-gray max-w-none">
            <ul className="space-y-2">
              <li>• Raffle runs monthly from the 1st to the last day of each month</li>
              <li>• Winners are drawn on the 1st of the following month</li>
              <li>• Each ticket costs $5 and gives you one entry</li>
              <li>• Maximum 10 tickets per person per month</li>
              <li>• Winners will be contacted via email</li>
              <li>• Prizes must be claimed within 30 days</li>
              <li>• All sales are final - no refunds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Raffle;
