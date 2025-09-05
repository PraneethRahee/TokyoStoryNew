import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, User, LogIn } from 'lucide-react';

const AuthPrompt = ({ message = "Please sign in to access this feature" }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <Lock className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/login"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </Link>
          
          <Link
            to="/signup"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <User className="w-5 h-5 mr-2" />
            Create Account
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-pink-500 hover:text-pink-600 font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPrompt;
