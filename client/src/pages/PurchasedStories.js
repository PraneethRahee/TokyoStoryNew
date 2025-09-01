import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Download, ShoppingBag, User, PenTool } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const PurchasedStories = () => {
  const { user } = useAuth();
  const [purchasedStories, setPurchasedStories] = useState([]);
  const [myStories, setMyStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchased'); // 'purchased' or 'my-stories'

  const fetchPurchasedStories = async () => {
    try {
      const stories = await authAPI.getPurchasedStories();
      setPurchasedStories(stories);
    } catch (error) {
      console.error('Error fetching purchased stories:', error);
    }
  };

  const fetchMyStories = async () => {
    try {
      const stories = await authAPI.getMyStories();
      setMyStories(stories);
    } catch (error) {
      console.error('Error fetching my stories:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPurchasedStories(), fetchMyStories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (story) => {
    const storyContent = `
Title: ${story.title}

${story.description}

---
Published on: ${formatDate(story.createdAt)}
Author: ${story.name}
    `;
    
    const blob = new Blob([storyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your stories...</p>
        </div>
      </div>
    );
  }

  const totalStories = purchasedStories.length + myStories.length;

  if (totalStories === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No stories yet</h2>
          <p className="text-gray-600 mb-6">Start exploring and purchasing stories, or share your own tales!</p>
          <div className="space-x-4">
            <Link
              to="/stories"
              className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Browse Stories
            </Link>
            <Link
              to="/submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            My Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your collection of purchased stories and your own published tales.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {totalStories} story{totalStories !== 1 ? 's' : ''} in your library
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('purchased')}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'purchased'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Purchased ({purchasedStories.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('my-stories')}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'my-stories'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <PenTool className="w-4 h-4" />
                <span>My Stories ({myStories.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === 'purchased' ? (
            // Purchased Stories
            purchasedStories.map((story) => (
              <div key={story._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={story.imageUrl} 
                    alt={story.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Tokyo+Lore';
                    }}
                  />
                  {/* Purchased Badge */}
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Purchased
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {story.description}
                  </p>
                  
                  {/* Story Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Published {formatDate(story.createdAt)}</span>
                    </div>
                    {story.name && (
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{story.name}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link 
                      to={`/story/${story._id}`}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Story</span>
                    </Link>
                    <button
                      onClick={() => handleDownload(story)}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                      title="Download Story"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // My Published Stories
            myStories.map((story) => (
              <div key={story._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={story.imageUrl} 
                    alt={story.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Tokyo+Lore';
                    }}
                  />
                  {/* Published Badge */}
                  <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Published
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {story.description}
                  </p>
                  
                  {/* Story Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Published {formatDate(story.createdAt)}</span>
                    </div>
                    <div className="text-blue-600 font-medium">
                      Your Story
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link 
                      to={`/story/${story._id}`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>View Story</span>
                    </Link>
                    <button
                      onClick={() => handleDownload(story)}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                      title="Download Story"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Want more stories?
          </h2>
          <p className="text-gray-600 mb-6">
            Discover more hidden gems and fascinating tales from Tokyo.
          </p>
          <div className="space-x-4">
            <Link
              to="/stories"
              className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Browse More Stories
            </Link>
            <Link
              to="/submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasedStories;
