import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ListingCard from '../components/ListingCard';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('date');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.get('/listings')
      .then(res => {
        setListings(res.data);
        setFiltered(res.data);
      })
      .catch(() => setError('Failed to load listings'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let data = [...listings];
    if (search) {
      data = data.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (location) {
      data = data.filter(l => l.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (priceRange[1] < 10000) {
      data = data.filter(l => l.price >= priceRange[0] && l.price <= priceRange[1]);
    }
    if (sort === 'price') {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      data.sort((a, b) => b.price - a.price);
    } else {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFiltered(data);
  }, [search, location, sort, priceRange, listings]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Discovering amazing places...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-red-500 text-6xl mb-4">😔</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(listings.map(l => l.location)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Getaway
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover unique places to stay, connect with hosts, and create unforgettable memories
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent appearance-none cursor-pointer"
                >
                  <option value="">Any location</option>
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <button className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg">
                Search
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
      </div>

      {/* Filters and Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-rose-300 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters
              </button>
              <span className="text-gray-600">
                {filtered.length} of {listings.length} listings
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all duration-200"
              >
                <option value="date">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-300 text-8xl mb-6">🏠</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">No listings found</h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              {search || location ? 'Try adjusting your search criteria or explore all listings.' : 'Be the first to create an amazing listing!'}
            </p>
            {!search && !location && (
              <button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Refresh Listings
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 