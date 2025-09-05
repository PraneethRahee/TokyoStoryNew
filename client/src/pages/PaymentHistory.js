import React, { useEffect, useState } from 'react';
import { historyAPI } from '../utils/api';
import { Calendar, CreditCard, Ticket } from 'lucide-react';

const formatDate = (d) => new Date(d).toLocaleString();

const centsToDollars = (c) => `$${(c / 100).toFixed(2)}`;

const PaymentHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [raffleHistory, setRaffleHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await historyAPI.getPaymentHistory();
        setPurchaseHistory(data.purchaseHistory || []);
        setRaffleHistory(data.raffleHistory || []);
      } catch (e) {
        setError('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment History</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="w-5 h-5 text-pink-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Purchases</h2>
            </div>
            {purchaseHistory.length === 0 ? (
              <p className="text-gray-600">No purchases yet.</p>
            ) : (
              <div className="space-y-4">
                {purchaseHistory.map((p, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {formatDate(p.createdAt)}
                      </div>
                      <div className="font-semibold text-gray-900">{centsToDollars(p.amount)}</div>
                    </div>
                    <ul className="text-sm text-gray-700 list-disc pl-5">
                      {(p.items || []).map((it, i) => (
                        <li key={i}>{it.title} × {it.quantity} — {centsToDollars(it.price)}</li>
                      ))}
                    </ul>
                    {p.sessionId && (
                      <div className="text-xs text-gray-500 mt-2">Session: {p.sessionId}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Ticket className="w-5 h-5 text-indigo-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Raffle Entries</h2>
            </div>
            {raffleHistory.length === 0 ? (
              <p className="text-gray-600">No raffle entries yet.</p>
            ) : (
              <div className="space-y-4">
                {raffleHistory.map((r, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {formatDate(r.createdAt)}
                      </div>
                      <div className="font-semibold text-gray-900">{centsToDollars(r.amount)}</div>
                    </div>
                    <div className="text-sm text-gray-700">Tickets: {r.tickets}</div>
                    {r.sessionId && (
                      <div className="text-xs text-gray-500 mt-2">Session: {r.sessionId}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
