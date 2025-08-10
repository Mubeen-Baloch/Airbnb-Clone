import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      // Request timeout
      return Promise.reject(new Error('Request timeout. Please check your connection and try again.'));
    }
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 503 && data.error === 'Google OAuth not configured') {
        // Google OAuth not available
        return Promise.reject(new Error('Google login is currently unavailable. Please use email/password login.'));
      }
      
      return Promise.reject(new Error(data.message || data.error || 'An error occurred'));
    } else if (error.request) {
      // Network error
      return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection.'));
    } else {
      // Other error
      return Promise.reject(error);
    }
  }
);

export function connectWebSocket(token, onMessage) {
  const ws = new WebSocket(
    (process.env.REACT_APP_WS_URL || 'ws://localhost:5000')
  );
  
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'auth', token }));
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('WebSocket message parsing error:', error);
    }
  };
  
  ws.onclose = () => {
    console.log('WebSocket connection closed. Attempting to reconnect...');
    setTimeout(() => {
      if (token) {
        connectWebSocket(token, onMessage);
      }
    }, 3000);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return ws;
}

export default api; 