import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Calendar, CheckCircle, AlertCircle, ShoppingCart, Check, PenTool } from 'lucide-react';
import { storiesAPI, authAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [purchasedStories, setPurchasedStories] = useState([]);
  const [myStories, setMyStories] = useState([]);
  const location = useLocation();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const handleRefresh = () => {
    fetchStories();
  };

  const handleAddToCart = (story) => {
    addToCart(story);
    setNotification({
      type: 'success',
      message: `${story.title} added to cart!`
    });
    setTimeout(() => setNotification(null), 2000);
  };


  const isStoryPurchased = (storyId) => {
    return purchasedStories.some(story => story._id === storyId);
  };

  
  const isMyStory = (storyId) => {
    return myStories.some(story => story._id === storyId);
  };


  const defaultStories = [
    {
      id: '1',
      title: 'The Midnight Ramen Master',
      description: 'In a narrow alley behind Shibuya station, an elderly chef serves the city\'s most secretive bowl of ramen to those who know the password.',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      price: 9.99
    },
    {
      id: '2',
      title: 'Cherry Blossoms of Memory Lane',
      description: 'Every spring, locals gather at this forgotten park where century-old sakura trees bloom in perfect synchronization with lost love stories.',
      imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      price: 12.99
    },
    {
      id: '3',
      title: 'The Underground Art Gallery',
      description: 'Beneath the bustling streets of Harajuku lies a secret world where street artists have been leaving their mark for over three decades.',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      price: 8.99
    },
    {
      id: '4',
      title: 'Lost in Translation at Golden Gai',
      description: 'A traveler recounts a night of unexpected friendships and miscommunications in Shinjuku\'s tiny, vibrant bar district.',
      imageUrl: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      price: 11.99
    },
    {
      id: '5',
      title: 'The Whispering Gardens of Shinjuku Gyoen',
      description: 'An escape from the urban bustle, where ancient trees and serene ponds hold secrets whispered by the wind through generations.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      price: 10.99
    },
    {
      id: '6',
      title: 'Akihabara\'s Electric Dreams',
      description: 'A young inventor finds inspiration amidst the neon glow and bustling arcades of Tokyo\'s famous electric town, dreaming of future tech.',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      price: 13.99
    }
  ];

  const fetchUserData = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const [purchased, myStoriesData] = await Promise.all([
          authAPI.getPurchasedStories(),
          authAPI.getMyStories()
        ]);
        setPurchasedStories(purchased);
        setMyStories(myStoriesData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  }, [isAuthenticated]);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await storiesAPI.getAll();
      

      const backendStories = data.map(story => ({
        id: story._id || story.id,
        title: story.title,
        description: story.description,
        imageUrl: story.imageUrl,
        name: story.name,
        createdAt: story.createdAt
      }));
      

      const allStories = [...backendStories, ...defaultStories];
      setStories(allStories);
      

      if (backendStories.length > 0) {
        setNotification({
          type: 'success',
          message: `Loaded ${backendStories.length} user stories and ${defaultStories.length} featured stories`
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      setStories(defaultStories);
      setNotification({
        type: 'error',
        message: 'Failed to load user stories. Showing featured stories only.'
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
    fetchUserData();
  }, [isAuthenticated, fetchStories, fetchUserData]);

  useEffect(() => {
    if (location.pathname === '/stories') {
      fetchStories();
      fetchUserData();
    }
  }, [location.pathname, fetchStories, fetchUserData]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStoryStatus = (story) => {
    const storyId = story.id || story._id;
    
    if (isMyStory(storyId)) {
      return {
        type: 'my-story',
        text: 'Your Story',
        icon: <PenTool className="w-4 h-4" />,
        className: 'bg-blue-500 text-white'
      };
    }
    
    if (isStoryPurchased(storyId)) {
      return {
        type: 'purchased',
        text: 'Purchased',
        icon: <Check className="w-4 h-4" />,
        className: 'bg-green-500 text-white'
      };
    }
    
    return {
      type: 'available',
      text: 'Add to Cart',
      icon: <ShoppingCart className="w-4 h-4" />,
      className: 'bg-pink-500 hover:bg-pink-600 text-white'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Tokyo Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Immerse yourself in the hidden narratives of Japan's capital city. Each story reveals a different facet of Tokyo's complex character, from ancient traditions to cutting-edge culture.
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto mb-6">
            These tales are collected from locals, travelers, artists, and dreamers who have experienced Tokyo's magic firsthand. Let their words transport you to places you never knew existed in this incredible metropolis.
          </p>
          <button
            onClick={handleRefresh}
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Refresh Stories
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => {
            const status = getStoryStatus(story);
            const storyId = story.id || story._id;
            
            return (
              <div key={storyId} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={story.imageUrl} 
                    alt={story.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Tokyo+Lore';
                    }}
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
                    <div className="flex items-center space-x-1">
                      {status.icon}
                      <span>{status.text}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-5">
                    {story.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-pink-600">
                      ${story.price || 9.99}
                    </span>
                    {status.type === 'available' ? (
                      <button
                        onClick={() => handleAddToCart({ ...story, price: story.price || 9.99 })}
                        className="flex items-center space-x-1 bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <button
                        className="flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium cursor-not-allowed"
                        disabled
                        style={{
                          backgroundColor: status.type === 'my-story' ? '#3B82F6' : '#10B981',
                          color: 'white'
                        }}
                      >
                        {status.icon}
                        <span>{status.text}</span>
                      </button>
                    )}
                  </div>
                  {story.name && (
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{story.name}</span>
                      </div>
                      {story.createdAt && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(story.createdAt)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Link 
                    to={`/story/${storyId}`}
                    className="inline-block text-pink-500 hover:text-pink-600 font-medium text-sm"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Have a story to share?
          </h2>
          <p className="text-gray-600 mb-6">
            Your Tokyo experience could inspire others to discover the city's hidden gems.
          </p>
          <Link
            to="/submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Share Your Story
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Stories;
