import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Your payment was cancelled. No charges were made to your account.
          </p>

          <p className="text-gray-500 mb-8">
            If you have any questions about your payment, please contact our support team.
          </p>

          <div className="space-y-4">
            <Link
              to="/stories"
              className="inline-flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stories
            </Link>
            
            <div className="text-sm text-gray-500">
              You can try the payment again anytime using the payment widget.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
