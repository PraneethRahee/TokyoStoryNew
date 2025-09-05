import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

const ErrorPopup = ({ 
  message, 
  type = 'error', 
  isVisible, 
  onClose, 
  duration = 5000 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 shadow-green-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 shadow-yellow-100';
      default:
        return 'bg-red-50 border-red-200 text-red-800 shadow-red-100';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-300 ease-in-out ${
          isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${getColors()}`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
