import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Calendar, DollarSign, Package } from 'lucide-react';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [raffleHistory, setRaffleHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch('/api/auth/payment-history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPurchaseHistory(data.purchaseHistory || []);
          setRaffleHistory(data.raffleHistory || []);
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPaymentHistory();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
          <p className="text-gray-600">View your purchase and raffle history</p>
        </div>

        <div className="grid gap-8">
          {/* Purchase History */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Package className="w-6 h-6 text-pink-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Purchase History</h2>
            </div>
            
            {purchaseHistory.length > 0 ? (
              <div className="space-y-4">
                {purchaseHistory.map((purchase, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {purchase.items?.length || 0} items
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {formatAmount(purchase.amount)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(purchase.createdAt)}
                    </div>
                    {purchase.items && (
                      <div className="mt-2 text-sm text-gray-600">
                        {purchase.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between">
                            <span>{item.title}</span>
                            <span>${(item.price / 100).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No purchase history found</p>
              </div>
            )}
          </div>

          {/* Raffle History */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-pink-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Raffle History</h2>
            </div>
            
            {raffleHistory.length > 0 ? (
              <div className="space-y-4">
                {raffleHistory.map((raffle, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {raffle.tickets} tickets
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {formatAmount(raffle.amount)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(raffle.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No raffle history found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
