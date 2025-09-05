import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import ErrorPopup from '../components/ErrorPopup';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, BookOpen, PenTool } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signup, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowError(true);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName
    };

    const result = await signup(userData);
    
    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <ErrorPopup
        message={errorMessage}
        type="error"
        isVisible={showError}
        onClose={() => setShowError(false)}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200 to-blue-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${15 + i * 12}%`,
                top: `${8 + i * 15}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2.5s'
              }}
            >
              <Sparkles className="w-3 h-3 text-pink-400 opacity-60" />
            </div>
          ))}
        </div>

        <div className="max-w-lg w-full space-y-8 relative z-10">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Join Tokyo Story
              </h1>
              <p className="text-gray-600">
                Create your account and start sharing your tales
              </p>
            </div>
          </div>

          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-2xl animate-slide-up">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`pl-10 bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 transition-all duration-200 ${
                          errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                        placeholder="First name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`pl-10 bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 transition-all duration-200 ${
                          errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                        placeholder="Last name"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className={`pl-10 bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 transition-all duration-200 ${
                        errors.username ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="Choose a username"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 transition-all duration-200 ${
                        errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-10 bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 transition-all duration-200 ${
                        errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
                  
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 pr-10 bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-8 space-y-4">
                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-pink-600 hover:text-pink-700 transition-colors duration-200"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>

                <div className="text-center">
                  <Link
                    to="/"
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm flex items-center justify-center space-x-1"
                  >
                    <span>←</span>
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
      `}</style>
    </>
  );
};

export default Signup;
