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
    if (sort === 'price') {
      data.sort((a, b) => a.price - b.price);
    } else {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFiltered(data);
  }, [search, location, sort, listings]);

  if (loading) return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading listings...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="container mx-auto p-4">
      <div className="text-center text-red-500">
        <p className="text-lg font-semibold">Error loading listings</p>
        <p className="text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(listings.map(l => l.location)));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Listings</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <select
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Locations</option>
          {uniqueLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="date">Sort by Date</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No listings found</h3>
          <p className="text-gray-500">
            {search || location ? 'Try adjusting your search criteria.' : 'Be the first to create a listing!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 