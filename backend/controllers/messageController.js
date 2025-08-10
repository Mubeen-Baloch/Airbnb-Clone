const Message = require('../models/Message');
const { encrypt, decrypt } = require('../utils/cryptoUtils');

exports.sendMessage = async (req, res) => {
  try {
    const { recipient, content, listing } = req.body;
    
    // Validate that the recipient exists and is related to the listing
    const Listing = require('../models/Listing');
    const listingDoc = await Listing.findById(listing);
    if (!listingDoc) {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    
    // Ensure the sender is either the listing owner or a potential guest
    const isOwner = listingDoc.owner.toString() === req.user._id.toString();
    const isRecipientOwner = listingDoc.owner.toString() === recipient;
    const isRecipientGuest = recipient !== listingDoc.owner.toString();
    
    if (!isOwner && !isRecipientGuest) {
      return res.status(403).json({ msg: 'Not authorized to send message' });
    }
    
    const encrypted = encrypt(content);
    const message = await Message.create({
      sender: req.user._id,
      recipient,
      listing,
      content: encrypted,
    });
    
    // Populate sender and recipient details before sending response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar');
    
    res.status(201).json({ 
      ...populatedMessage.toObject(), 
      content: content // Send decrypted content in response
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id },
      ],
    })
    .populate('sender', 'name avatar')
    .populate('recipient', 'name avatar')
    .sort('createdAt');
    
    const decrypted = messages.map(m => ({
      ...m.toObject(),
      content: decrypt(m.content),
    }));
    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Updated to only return messages where the current user is involved
exports.getListingMessages = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    // Get the listing to verify ownership
    const Listing = require('../models/Listing');
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    
    // Find messages where current user is either sender or recipient
    const messages = await Message.find({
      listing: listingId,
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ]
    })
    .populate('sender', 'name avatar')
    .populate('recipient', 'name avatar')
    .sort('createdAt');
    
    const decrypted = messages.map(m => ({
      ...m.toObject(),
      content: decrypt(m.content),
    }));
    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Enhanced endpoint to get conversations for listing owner with optional guest filtering
exports.getOwnerConversations = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { guestId } = req.query; // Optional query parameter for specific guest conversation
    
    // Verify the user is the listing owner
    const Listing = require('../models/Listing');
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    let query = {
      listing: listingId,
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ]
    };
    
    // If guestId is provided, filter to only messages between owner and that specific guest
    if (guestId) {
      query.$and = [
        {
          $or: [
            { sender: req.user._id, recipient: guestId },
            { sender: guestId, recipient: req.user._id }
          ]
        }
      ];
    }
    
    // Get messages for this listing where owner is either sender or recipient
    const messages = await Message.find(query)
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .sort('createdAt');
    
    const decrypted = messages.map(m => ({
      ...m.toObject(),
      content: decrypt(m.content),
    }));
    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 