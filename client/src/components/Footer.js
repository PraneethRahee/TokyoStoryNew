import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-6 h-6 text-pink-500" />
              <span className="text-xl font-semibold text-gray-900">Tokyo Lore</span>
            </div>
            <p className="text-gray-600 mb-4">
              Tokyo Lore celebrates the hidden stories, forgotten corners, and secret beauty of Japan's capital through photography, poetry, and street art.
            </p>
            <p className="text-sm text-gray-500">
              Join our community of storytellers and discover Tokyo like never before.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/stories" className="hover:text-gray-900 transition-colors">Featured Stories</Link></li>
              <li><Link to="/stories" className="hover:text-gray-900 transition-colors">Photo Gallery</Link></li>
              <li><Link to="/stories" className="hover:text-gray-900 transition-colors">Street Art Map</Link></li>
              <li><Link to="/stories" className="hover:text-gray-900 transition-colors">Community</Link></li>
              <li><Link to="/submit" className="hover:text-gray-900 transition-colors">Submit Story</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/stories" className="hover:text-gray-900 transition-colors">Tokyo Guide</Link></li>
              <li><Link to="/stories" className="hover:text-gray-900 transition-colors">Photography Tips</Link></li>
              <li><Link to="/stories" className="hover:text-gray-900 transition-colors">Writing Guide</Link></li>
              <li><Link to="/stories" className="hover:text-gray-900 transition-colors">Contact Us</Link></li>
              <li><Link to="/stories" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Get the latest Tokyo stories delivered to your inbox. Never miss a hidden gem.
            </p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
              <button className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            © 2025 Tokyo Lore. All rights reserved. Made by Arpit Sehal for Tokyo's stories.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
