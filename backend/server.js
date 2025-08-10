const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('./config/passport');
const errorHandler = require('./middleware/errorHandler');

const http = require('http');
const WebSocket = require('ws');
const Message = require('./models/Message');
const { encrypt, decrypt } = require('./utils/cryptoUtils');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static('uploads'));
app.use(errorHandler);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/listings/:listingId/reviews', require('./routes/reviewRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Airbnb Clone API is running!', 
    version: '1.0.0',
    endpoints: {
      docs: '/api-docs',
      auth: '/api/auth',
      listings: '/api/listings',
      users: '/api/users',
      messages: '/api/messages'
    }
  });
});

//app.get('/', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
  //const jwt = require('jsonwebtoken');
  //const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
  //res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?token=${token}`);
//});

require('./swagger')(app);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Map userId to WebSocket
const clients = new Map();

wss.on('connection', (ws, req) => {
  ws.on('message', async (msg) => {
    try {
      const { token, recipient, content, listing } = JSON.parse(msg);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const sender = await User.findById(decoded.id);
      if (!sender) return;
      // Encrypt and save message
      const encrypted = encrypt(content);
      const message = await Message.create({ sender: sender._id, recipient, listing, content: encrypted });
      // Send to sender and recipient if connected
      [sender._id.toString(), recipient].forEach(uid => {
        const client = clients.get(uid);
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            _id: message._id,
            sender: sender._id,
            recipient,
            listing,
            content,
            createdAt: message.createdAt,
          }));
        }
      });
    } catch (err) {
      // Ignore errors
    }
  });
  ws.on('close', () => {
    for (const [uid, client] of clients.entries()) {
      if (client === ws) clients.delete(uid);
    }
  });
  // On auth, map userId to ws
  ws.on('message', (msg) => {
    try {
      const { token, type } = JSON.parse(msg);
      if (type === 'auth') {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        clients.set(decoded.id, ws);
      }
    } catch {}
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
