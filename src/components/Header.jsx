import React from 'react';
import { Search, Home, Menu, User, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-center md:justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
            <div className="flex items-center">
              <img src="/logo.png" alt="AZAD MEDIA LIVE" className="h-20 w-auto" />
            </div>
            <div className="flex flex-col ml-2">
              <span className="text-brand-red font-bold text-3xl leading-none">AZAD</span>
              <span className="text-base text-gray-800 font-bold tracking-widest mt-1">MEDIA LIVE</span>
            </div>
          </Link>
        </div>


      </div>


      

    </header>
  );
};

export default Header;
