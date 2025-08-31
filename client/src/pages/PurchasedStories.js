import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Download, ShoppingBag } from 'lucide-react';
import { usePurchase } from '../context/PurchaseContext';

const PurchasedStories = () => {
  const { purchases } = usePurchase();

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

  if (purchases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No purchased stories yet</h2>
          <p className="text-gray-600 mb-6">Start exploring and purchasing stories to see them here!</p>
          <Link
            to="/stories"
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Browse Stories
          </Link>
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
            My Purchased Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your collection of Tokyo stories. Access your purchased content anytime, anywhere.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {purchases.length} story{purchases.length !== 1 ? 's' : ''} in your library
          </div>
        </div>

        {/* Purchased Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {purchases.map((story) => (
            <div key={story.purchaseId} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                
                {/* Purchase Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Purchased {formatDate(story.purchaseDate)}</span>
                  </div>
                  <div className="text-green-600 font-medium">
                    ${story.price}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link 
                    to={`/story/${story.id}`}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Read Story</span>
                  </Link>
                  <button
                    onClick={() => {
                      // Create a downloadable version of the story
                      const storyContent = `
Title: ${story.title}

${story.description}

---
Purchased on: ${formatDate(story.purchaseDate)}
Price: $${story.price}
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
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                    title="Download Story"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Want more stories?
          </h2>
          <p className="text-gray-600 mb-6">
            Discover more hidden gems and fascinating tales from Tokyo.
          </p>
          <Link
            to="/stories"
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Browse More Stories
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchasedStories;
