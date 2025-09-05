import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, ShoppingCart, BookOpen, User, LogOut, Ticket, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePurchase } from '../context/PurchaseContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { purchases } = usePurchase();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-pink-500" />
            <span className="text-xl font-semibold text-gray-900">Tokyo Lore</span>
          </Link>
          <nav className="flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-pink-500' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/stories" 
                  className={`font-medium transition-colors ${
                    isActive('/stories') ? 'text-pink-500' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Stories
                </Link>
                <Link 
                  to="/purchased" 
                  className={`font-medium transition-colors ${
                    isActive('/purchased') ? 'text-pink-500' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>My Stories</span>
                    {purchases.length > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {purchases.length}
                      </span>
                    )}
                  </div>
                </Link>
                <Link 
                  to="/raffle" 
                  className={`font-medium transition-colors ${
                    isActive('/raffle') ? 'text-pink-500' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Ticket className="w-4 h-4" />
                    <span>Raffle</span>
                  </div>
                </Link>
                <Link 
                  to="/payments" 
                  className={`font-medium transition-colors ${
                    isActive('/payments') ? 'text-pink-500' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <CreditCard className="w-4 h-4" />
                    <span>Payments</span>
                  </div>
                </Link>
                <Link 
                  to="/submit" 
                  className={`font-medium transition-colors ${
                    isActive('/submit') ? 'text-pink-500' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Submit
                </Link>
                <Link 
                  to="/cart" 
                  className="relative p-2 text-gray-600 hover:text-pink-500 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {user?.firstName || user?.username}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-pink-500 transition-colors text-sm font-medium"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-pink-500 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
