import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
          <p className="text-gray-600">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/cart"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Return to Cart
          </Link>
          
          <Link
            to="/stories"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Need help? Contact our support team for assistance.
        </p>
      </div>
    </div>
  );
};

export default PaymentCancelled;
