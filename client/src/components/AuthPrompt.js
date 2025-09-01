import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, User, ArrowRight } from 'lucide-react';

const AuthPrompt = ({ 
  title = "Authentication Required", 
  message = "Please log in or sign up to access this feature.",
  showSignup = true,
  showLogin = true 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white/10 backdrop-blur-lg">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            {title}
          </h2>
          <p className="mt-2 text-gray-300">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          {showLogin && (
            <Link
              to="/login"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <User className="w-5 h-5 mr-2" />
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}
          
          {showSignup && (
            <Link
              to="/signup"
              className="w-full flex items-center justify-center px-4 py-3 border border-white/20 text-base font-medium rounded-lg text-white bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all duration-200"
            >
              Create Account
            </Link>
          )}
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;
