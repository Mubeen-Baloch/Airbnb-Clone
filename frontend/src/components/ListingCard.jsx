import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => (
  <Link to={`/listings/${listing._id}`} className="block">
    <div className="bg-white rounded shadow p-4 hover:shadow-lg transition">
      <img
        src={listing.images?.[0] ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${listing.images[0]}` : '/logo192.png'}
        alt={listing.title}
        className="w-full h-48 object-cover rounded mb-2"
        onError={(e) => {
          e.target.src = '/logo192.png';
        }}
      />
      <h2 className="text-xl font-bold">{listing.title}</h2>
      <p className="text-gray-600">{listing.location}</p>
      <p className="text-blue-600 font-semibold mt-2">${listing.price}</p>
    </div>
  </Link>
);

export default ListingCard; 