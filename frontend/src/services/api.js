import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

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