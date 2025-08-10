const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  content: { type: String, required: true }, // encrypted
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema); 