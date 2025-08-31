import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, PenTool, Heart, Users, Award, Globe } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      

      {/* Hero Section */}
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
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
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

      {/* Stats Section */}
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

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-3xl mx-auto">
            Your Tokyo experience could inspire others to discover the city's hidden gems. Every story matters, every moment counts.
          </p>
          <Link
            to="/submit"
            className="inline-block bg-white text-pink-600 font-medium py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
          >
            Start Writing Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
