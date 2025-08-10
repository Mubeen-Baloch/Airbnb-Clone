import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">Airbnb Clone</Link>
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        {user && <Link to="/create-listing" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Create Listing</Link>}
        {user && <Link to="/my-listings" className="hover:underline">My Listings</Link>}
        {user && <Link to="/profile" className="hover:underline">Profile</Link>}
        {user && <Link to="/wishlist" className="hover:underline">Wishlist</Link>}
        {!user && <Link to="/login" className="hover:underline">Login</Link>}
        {!user && <Link to="/register" className="hover:underline">Register</Link>}
        {user && <button onClick={handleLogout} className="hover:underline text-red-500">Logout</button>}
      </nav>
    </header>
  );
};

export default Header; 