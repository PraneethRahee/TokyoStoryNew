import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, User, Calendar, ArrowLeft, Clock, Heart, Share2, BookOpen } from 'lucide-react';
import { storiesAPI } from '../utils/api';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  // Default stories for fallback
  const defaultStories = {
    '1': {
      id: '1',
      title: 'The Midnight Ramen Master',
      description: 'In a narrow alley behind Shibuya station, an elderly chef serves the city\'s most secretive bowl of ramen to those who know the password. Every night at 11 PM, a small group of regulars gathers in this unassuming establishment, where the master crafts his signature broth from a recipe passed down through three generations.\n\nThe secret lies not just in the ingredients, but in the timing and the atmosphere. The chef believes that ramen is not just food—it\'s a meditation, a moment of peace in the chaos of Tokyo\'s endless energy. As steam rises from the bowls and the first slurp echoes through the quiet space, strangers become friends, sharing stories of their day while the master watches with a knowing smile.\n\nThis is not just a meal; it\'s a ritual, a nightly communion with the soul of the city itself.',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      author: 'Featured Story',
      date: '2025-01-15'
    },
    '2': {
      id: '2',
      title: 'Cherry Blossoms of Memory Lane',
      description: 'Every spring, locals gather at this forgotten park where century-old sakura trees bloom in perfect synchronization with lost love stories. The petals fall like pink snow, covering the ground in a carpet of memories and dreams.\n\nHere, under the gentle sway of cherry blossoms, people come to remember, to hope, and to let go. The trees have witnessed countless first kisses, whispered promises, and tearful goodbyes. They stand as silent guardians of the heart\'s most precious moments.\n\nAs the sun sets and the lanterns flicker to life, the park transforms into a magical realm where time seems to stand still. Visitors leave their wishes tied to the branches, hoping that the sakura spirits will carry their dreams to the heavens.',
      imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      author: 'Featured Story',
      date: '2025-01-14'
    },
    '3': {
      id: '3',
      title: 'The Underground Art Gallery',
      description: 'Beneath the bustling streets of Harajuku lies a secret world where street artists have been leaving their mark for over three decades. This hidden gallery, accessible only to those who know where to look, showcases the raw creativity that pulses through Tokyo\'s underground scene.\n\nThe walls are covered in vibrant murals, each telling a story of rebellion, hope, and the human spirit. Artists from around the world have contributed to this ever-evolving canvas, creating a living museum that changes with the seasons and the times.\n\nIn this subterranean sanctuary, art is not just decoration—it\'s a conversation, a protest, a celebration of life in all its messy, beautiful complexity.',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      author: 'Featured Story',
      date: '2025-01-13'
    },
    '4': {
      id: '4',
      title: 'Lost in Translation at Golden Gai',
      description: 'A traveler recounts a night of unexpected friendships and miscommunications in Shinjuku\'s tiny, vibrant bar district. In this maze of narrow alleys and intimate drinking establishments, language barriers dissolve in the universal language of laughter and shared experiences.\n\nEach bar has its own character, its own story, its own regulars who welcome strangers with open arms and curious questions. Through broken English, hand gestures, and the occasional translation app, conversations flow like the sake that warms both body and soul.\n\nThis is where Tokyo\'s heart beats loudest, where the city\'s true character reveals itself in the most unexpected moments of human connection.',
      imageUrl: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      author: 'Featured Story',
      date: '2025-01-12'
    },
    '5': {
      id: '5',
      title: 'The Whispering Gardens of Shinjuku Gyoen',
      description: 'An escape from the urban bustle, where ancient trees and serene ponds hold secrets whispered by the wind through generations. This oasis of tranquility in the heart of Tokyo\'s busiest district offers a sanctuary for reflection and renewal.\n\nThe gardens have witnessed the city\'s transformation from a quiet fishing village to a global metropolis, yet they remain unchanged in their ability to soothe the soul. Visitors come here to find peace, to remember, to dream.\n\nAs the seasons change, so too does the garden\'s personality—from the delicate cherry blossoms of spring to the fiery maples of autumn, each visit offers a new perspective on beauty and time.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      author: 'Featured Story',
      date: '2025-01-11'
    },
    '6': {
      id: '6',
      title: 'Akihabara\'s Electric Dreams',
      description: 'A young inventor finds inspiration amidst the neon glow and bustling arcades of Tokyo\'s famous electric town, dreaming of future tech. In this district where the past meets the future, innovation is not just encouraged—it\'s celebrated.\n\nThe streets pulse with energy, both literal and metaphorical, as visitors explore shops filled with the latest gadgets and vintage treasures. Here, technology is not cold and impersonal, but warm and human, designed to enhance the human experience.\n\nIn the glow of countless screens and the hum of countless machines, dreams take shape and the future feels within reach.',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      author: 'Featured Story',
      date: '2025-01-10'
    }
  };

  const fetchStory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to fetch from backend
      try {
        const data = await storiesAPI.getAll();
        const backendStory = data.find(s => s._id === id);
        if (backendStory) {
          setStory({
            id: backendStory._id,
            title: backendStory.title,
            description: backendStory.description,
            imageUrl: backendStory.imageUrl,
            author: backendStory.name,
            date: backendStory.createdAt
          });
          return;
        }
      } catch (apiError) {
        console.log('Backend story not found, checking default stories...');
      }
      
      // Fallback to default stories
      const defaultStory = defaultStories[id];
      if (defaultStory) {
        setStory(defaultStory);
      } else {
        setError('Story not found');
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      setError('Failed to load story');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  useEffect(() => {
    if (story) {
      // Calculate reading time (average 200 words per minute)
      const wordCount = story.description.split(' ').length;
      const estimatedTime = Math.ceil(wordCount / 200);
      setReadingTime(estimatedTime);
    }
  }, [story]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.description.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-red-500 text-6xl mb-4">📖</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Story Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/stories"
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6 animate-slide-in-left">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </button>
        </div>

        {/* Story Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 animate-fade-in-up">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img 
              src={story.imageUrl} 
              alt={story.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Tokyo+Lore';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 animate-fade-in stagger-1">
                {story.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm animate-fade-in stagger-2">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{story.author}</span>
                </div>
                {story.date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(story.date)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fade-in-up stagger-3">
          <div className="prose prose-lg max-w-none">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-pink-500" />
                <span className="text-sm text-gray-600">Story</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors duration-200 ${
                    isLiked 
                      ? 'bg-pink-100 text-pink-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{isLiked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600 transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
            
            <div className="text-gray-800 leading-relaxed space-y-4">
              {story.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="animate-fade-in" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-8 text-center text-white animate-fade-in-up stagger-4">
          <h2 className="text-2xl font-bold mb-4">Share Your Tokyo Story</h2>
          <p className="text-pink-100 mb-6">
            Have an experience that deserves to be told? Let others discover the magic of Tokyo through your eyes.
          </p>
          <Link
            to="/submit"
            className="inline-block bg-white text-pink-600 font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Submit Your Story
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
