import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, PenTool, Heart, Users, Award, Globe, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-white to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-gray-900">
              Discover Tokyo's{' '}
              <span className="text-pink-500">Untold Stories</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-3xl mx-auto">
              Journey through hidden alleyways, forgotten temples, and secret corners where Tokyo's most captivating stories come alive through art, photography, and poetry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/stories"
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Explore Stories
                  </Link>
                  <Link
                    to="/submit"
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <PenTool className="w-4 h-4" />
                    Share Your Story
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Login to Explore
                  </Link>
                  <Link
                    to="/signup"
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <PenTool className="w-4 h-4" />
                    Join Tokyo Lore
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                Where Stories Live
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Tokyo Lore is more than a collection of stories—it's a living tapestry of the city's soul. Every narrow alley holds secrets, every neon sign tells a tale, and every face in the crowd carries dreams that deserve to be shared.
                </p>
                <p>
                  Through the lens of photographers, the words of poets, and the creativity of street artists, we capture the essence of Tokyo that guidebooks never reveal. Join us in preserving and celebrating the stories that make this city extraordinary.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Tokyo night street scene" 
                  loading="lazy"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  <div>1000+</div>
                  <div>Stories Collected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Featured Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get a glimpse of the captivating tales that await you. Sign up to unlock the full collection and start your journey through Tokyo's hidden narratives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="The Midnight Ramen Master"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  The Midnight Ramen Master
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  In a narrow alley behind Shibuya station, an elderly chef serves the city's most secretive bowl of ramen...
                </p>
                <div className="text-pink-600 font-medium text-sm">
                  Login to read full story
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Cherry Blossoms of Memory Lane"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Cherry Blossoms of Memory Lane
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Every spring, locals gather at this forgotten park where century-old sakura trees bloom...
                </p>
                <div className="text-pink-600 font-medium text-sm">
                  Login to read full story
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="The Underground Art Gallery"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  The Underground Art Gallery
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Beneath the bustling streets of Harajuku lies a secret world where street artists...
                </p>
                <div className="text-pink-600 font-medium text-sm">
                  Login to read full story
                </div>
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="text-center">
              <Link
                to="/signup"
                className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Unlock All Stories
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1,247</h3>
              <p className="text-gray-600">Stories Shared</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">892</h3>
              <p className="text-gray-600">Contributors</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">156</h3>
              <p className="text-gray-600">Featured Stories</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">23</h3>
              <p className="text-gray-600">Countries Reached</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-3xl mx-auto">
            Your Tokyo experience could inspire others to discover the city's hidden gems. Every story matters, every moment counts.
          </p>
          {isAuthenticated ? (
            <Link
              to="/submit"
              className="inline-block bg-white text-pink-600 font-medium py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              Start Writing Now
            </Link>
          ) : (
            <Link
              to="/signup"
              className="inline-block bg-white text-pink-600 font-medium py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              Join to Share Stories
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
