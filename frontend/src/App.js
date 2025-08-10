import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import { Navigate } from 'react-router-dom';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const MyListings = lazy(() => import('./pages/MyListings'));
const CreateListing = lazy(() => import('./pages/CreateListing'));
const Profile = lazy(() => import('./pages/Profile'));
const LoginForm = lazy(() => import('./pages/LoginForm'));
const RegisterForm = lazy(() => import('./pages/RegisterForm'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));
const EditListing = lazy(() => import('./pages/EditListing'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

// Loading component with beautiful skeleton
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <div className="text-center">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-20 h-20 border-4 border-rose-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-rose-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-pink-400 rounded-full animate-bounce-gentle"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-teal-400 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-rose-400 rounded-full animate-bounce-gentle" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="mt-8 space-y-3">
        <div className="skeleton-text w-48 mx-auto"></div>
        <div className="skeleton-text w-32 mx-auto"></div>
      </div>
      
      <p className="text-gray-500 mt-6 text-sm animate-pulse">
        Loading amazing experiences...
      </p>
    </div>
  </div>
);

// Error boundary component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
    <div className="text-center max-w-md mx-auto">
      <div className="text-red-500 text-8xl mb-6">😱</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-6 text-sm">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="space-y-3">
        <button 
          onClick={resetErrorBoundary}
          className="btn-primary w-full"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="btn-secondary w-full"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
);

// Private route component with enhanced loading states
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="spinner-large mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Checking your credentials...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

// Main App component with performance optimizations
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50">
          <Header />
          <main className="py-8">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/listings/:id" element={<ListingDetail />} />
                <Route 
                  path="/edit-listing/:id" 
                  element={
                    <PrivateRoute>
                      <EditListing />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/my-listings" 
                  element={
                    <PrivateRoute>
                      <MyListings />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/wishlist" 
                  element={
                    <PrivateRoute>
                      <Wishlist />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/create-listing" 
                  element={
                    <PrivateRoute>
                      <CreateListing />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                
                {/* 404 route */}
                <Route 
                  path="*" 
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                      <div className="text-center max-w-md mx-auto p-8">
                        <div className="text-gray-300 text-8xl mb-6">🔍</div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
                        <p className="text-gray-600 mb-8 text-lg">
                          The page you're looking for doesn't exist or has been moved.
                        </p>
                        <button 
                          onClick={() => window.history.back()}
                          className="btn-primary mr-4"
                        >
                          Go Back
                        </button>
                        <button 
                          onClick={() => window.location.href = '/'}
                          className="btn-secondary"
                        >
                          Go Home
                        </button>
                      </div>
                    </div>
                  } 
                />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
