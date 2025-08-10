import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MyListings from './pages/MyListings';
import CreateListing from './pages/CreateListing';
import Profile from './pages/Profile';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import ListingDetail from './pages/ListingDetail';
import EditListing from './pages/EditListing';
import Wishlist from './pages/Wishlist';

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/edit-listing/:id" element={<PrivateRoute><EditListing /></PrivateRoute>} />
              <Route path="/my-listings" element={<PrivateRoute><MyListings /></PrivateRoute>} />
              <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
              <Route path="/create-listing" element={<PrivateRoute><CreateListing /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Routes>
          </main>
    </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
