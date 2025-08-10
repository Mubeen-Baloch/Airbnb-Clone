import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = () => {
    if (imageError) return '/logo192.png';
    if (listing.images?.[0]) {
      const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}${listing.images[0]}`;
    }
    return '/logo192.png';
  };

  return (
    <Link 
      to={`/listings/${listing._id}`} 
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-100">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={getImageUrl()}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
          />
          
          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(listing.price)}
            </span>
            <span className="text-sm text-gray-600 ml-1">/night</span>
          </div>

          {/* Location Badge */}
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
            <span className="text-white text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {listing.location}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end`}>
            <div className="p-4 w-full">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {listing.description || 'Beautiful accommodation waiting for you'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors duration-300">
            {listing.title}
          </h3>
          
          <p className="text-gray-600 mb-3 line-clamp-2">
            {listing.description || 'Experience the perfect blend of comfort and luxury in this stunning accommodation.'}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            {listing.bedrooms && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}
              </span>
            )}
            {listing.bathrooms && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-bold">★</span>
                </div>
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-bold">★</span>
                </div>
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-bold">★</span>
                </div>
              </div>
              <span className="text-sm text-gray-600">4.9 (128 reviews)</span>
            </div>
            
            <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isHovered 
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              View Details
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard; 