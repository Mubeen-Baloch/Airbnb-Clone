import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Filter, TrendingUp, Calendar, Star, Heart, Zap, Shield, Award, Loader2 } from 'lucide-react';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import { Button, Input, Card, Skeleton, Badge, Progress, Tabs } from '../components/ui';
import { useToast } from '../components/ui';

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
  const [activeTab, setActiveTab] = useState('all');
  
  // Phase 3: Infinite Scroll & Performance
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [itemsPerPage] = useState(12);
  const observer = useRef();
  const lastListingRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadingMore]);

  const { showToast } = useToast();

  // Enhanced data fetching with pagination
  const fetchListings = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoadingMore(true);
      const response = await api.get('/listings', {
        params: {
          page: pageNum,
          limit: itemsPerPage,
          search,
          location,
          sort,
          minPrice: priceRange[0],
          maxPrice: priceRange[1]
        }
      });
      
      const newListings = response.data.listings || response.data;
      const total = response.data.total || newListings.length;
      
      if (append) {
        setListings(prev => [...prev, ...newListings]);
        setFiltered(prev => [...prev, ...newListings]);
      } else {
        setListings(newListings);
        setFiltered(newListings);
      }
      
      setHasMore(newListings.length === itemsPerPage && (pageNum * itemsPerPage) < total);
      
      if (pageNum === 1) {
        showToast('success', 'Listings loaded successfully!');
      }
    } catch (err) {
      if (pageNum === 1) {
        setError('Failed to load listings');
        showToast('error', 'Failed to load listings. Please try again.');
      } else {
        showToast('error', 'Failed to load more listings');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, location, sort, priceRange, itemsPerPage, showToast]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchListings(1, false);
  }, [fetchListings]);

  useEffect(() => {
    if (page > 1) {
      fetchListings(page, true);
    }
  }, [page, fetchListings]);

  // Enhanced skeleton loading with better variety
  const renderSkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="space-y-4"
        >
          <Skeleton className="w-full h-48 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-3" />
            <div className="flex justify-between items-center">
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Use skeleton grid in loading state
  if (loading && page === 1) return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative inline-block"
          >
            {/* Enhanced main spinner with glassmorphism */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 w-full h-full bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-glass-lg"></div>
              <div className="absolute inset-2 w-full h-full border-4 border-rose-200 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-rose-500 rounded-full animate-spin"></div>
              </div>
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-800 mt-8 mb-4"
          >
            Loading Amazing Places...
          </motion.h2>
        </div>
        {renderSkeletonGrid()}
      </div>
    </div>
  );



  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 10 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="text-red-500 text-6xl mb-4"
        >
          😔
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="primary"
          size="lg"
          className="w-full"
        >
          Try Again
        </Button>
      </motion.div>
    </div>
  );

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(listings.map(l => l.location)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Hero Section with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Enhanced animated background elements with glassmorphism */}
        <motion.div
          className="absolute top-10 left-10 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-36 h-36 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Find Your Perfect
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
            >
              Getaway
            </motion.span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl text-white/90 mb-8 max-w-3xl mx-auto"
          >
            Discover unique accommodations, unforgettable experiences, and create memories that last a lifetime
          </motion.p>

          {/* Enhanced Search Section with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="max-w-4xl mx-auto"
          >
            <Card variant="glass" className="p-6 backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search listings..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-white/80 backdrop-blur-sm border-white/30 focus:bg-white focus:border-rose-300"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="glass"
                  size="lg"
                  className="w-full bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose StayEase?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of luxury, comfort, and adventure with our curated selection of premium accommodations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Secure & Safe", description: "Verified hosts and secure payments" },
              { icon: Star, title: "Premium Quality", description: "Handpicked luxury accommodations" },
              { icon: Zap, title: "Instant Booking", description: "Book your stay in seconds" },
              { icon: Award, title: "Best Prices", description: "Competitive rates guaranteed" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="text-center group"
              >
                <Card variant="glass" className="p-8 text-center hover:shadow-glow-lg transition-all duration-500">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border-t border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Card variant="glass" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300"
                    >
                      <option value="date">Latest</option>
                      <option value="price">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="space-y-2">
                      <Progress 
                        value={priceRange[1] / 100} 
                        className="w-full"
                        color="rose"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-rose-50 hover:border-rose-300">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Trending
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-rose-50 hover:border-rose-300">
                        <Calendar className="w-4 h-4 mr-1" />
                        Available Now
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-rose-50 hover:border-rose-300">
                        <Heart className="w-4 h-4 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Listings Section with Infinite Scroll */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Places</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {filtered.length} beautiful accommodations waiting for you
            </p>
          </motion.div>

          {/* Enhanced Tabs for Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              items={[
                { value: 'all', label: 'All Listings', count: filtered.length },
                { value: 'trending', label: 'Trending', count: Math.floor(filtered.length * 0.3) },
                { value: 'new', label: 'New Arrivals', count: Math.floor(filtered.length * 0.2) },
                { value: 'popular', label: 'Popular', count: Math.floor(filtered.length * 0.4) }
              ]}
              variant="glass"
            />
          </motion.div>

          {/* Enhanced Listings Grid with Infinite Scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="wait">
              {filtered.map((listing, index) => {
                // Add ref to last element for infinite scroll
                if (filtered.length === index + 1) {
                  return (
                    <div key={listing._id} ref={lastListingRef}>
                      <ListingCard listing={listing} index={index} />
                    </div>
                  );
                } else {
                  return <ListingCard key={listing._id} listing={listing} index={index} />;
                }
              })}
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Loading More Indicator */}
          {loadingMore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-center py-8"
            >
              <div className="flex items-center space-x-3 text-gray-600">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                <span className="text-lg">Loading more amazing places...</span>
              </div>
            </motion.div>
          )}

          {/* Enhanced Empty State */}
          {filtered.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
              <Button
                onClick={() => {
                  setSearch('');
                  setLocation('');
                  setPriceRange([0, 10000]);
                  setSort('date');
                }}
                variant="outline"
                size="lg"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* Enhanced End of Results */}
          {!hasMore && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center space-x-2 text-gray-500">
                <div className="w-16 h-px bg-gray-300"></div>
                <span className="text-sm font-medium">You've reached the end</span>
                <div className="w-16 h-px bg-gray-300"></div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 