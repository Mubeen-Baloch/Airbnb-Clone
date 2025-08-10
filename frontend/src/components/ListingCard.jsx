import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Star, Bed, Bath, Users } from 'lucide-react';
import { Card } from './ui';

const ListingCard = ({ listing, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link to={`/listings/${listing._id}`} className="block h-full">
        <Card 
          variant="glass" 
          hover={true}
          className="h-full group overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative overflow-hidden aspect-[4/3]">
            <motion.img
              src={getImageUrl()}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            
            {/* Like Button */}
            <motion.button
              onClick={handleLike}
              className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Heart 
                className={`w-5 h-5 transition-all duration-300 ${
                  isLiked ? 'text-rose-500 fill-current' : 'text-white'
                }`}
              />
            </motion.button>

            {/* Price Badge */}
            <motion.div
              className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-glass-lg border border-white/30"
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {formatPrice(listing.price)}
              </span>
              <span className="text-sm text-gray-600 ml-1">/night</span>
            </motion.div>

            {/* Location Badge */}
            <motion.div
              className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-2xl px-3 py-2 border border-white/20"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {listing.location}
              </span>
            </motion.div>

            {/* Hover Overlay */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="p-4 w-full"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-glass-lg">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {listing.description || 'Beautiful accommodation waiting for you'}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.h3 
              className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-rose-600 transition-colors duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {listing.title}
            </motion.h3>
            
            <motion.p 
              className="text-gray-600 mb-4 line-clamp-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {listing.description || 'Experience the perfect blend of comfort and luxury in this stunning accommodation.'}
            </motion.p>

            {/* Features */}
            <motion.div 
              className="flex items-center gap-4 text-sm text-gray-500 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {listing.bedrooms && (
                <span className="flex items-center gap-2 hover:text-rose-600 transition-colors duration-300">
                  <Bed className="w-4 h-4" />
                  {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}
                </span>
              )}
              {listing.bathrooms && (
                <span className="flex items-center gap-2 hover:text-rose-600 transition-colors duration-300">
                  <Bath className="w-4 h-4" />
                  {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
                </span>
              )}
              {listing.maxGuests && (
                <span className="flex items-center gap-2 hover:text-rose-600 transition-colors duration-300">
                  <Users className="w-4 h-4" />
                  {listing.maxGuests} guest{listing.maxGuests > 1 ? 's' : ''}
                </span>
              )}
            </motion.div>

            {/* Rating and Action */}
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Star className="w-3 h-3 text-white fill-current" />
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">4.9 (128 reviews)</span>
              </div>
              
              <motion.div
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  isHovered 
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-glow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Details
              </motion.div>
            </motion.div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-transparent via-rose-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Card>
      </Link>
    </motion.div>
  );
};

export default ListingCard; 