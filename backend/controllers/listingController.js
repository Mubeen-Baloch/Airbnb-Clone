const Listing = require('../models/Listing');
const mongoose = require('mongoose');

exports.createListing = async (req, res) => {
  try {
    const { title, description, location, price, images } = req.body;
    const listing = new Listing({
      title,
      description,
      location,
      price,
      images,
      owner: req.user._id,
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('owner', 'name avatar');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getListing = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    const listing = await Listing.findById(req.params.id).populate('owner', 'name avatar');
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    const updates = req.body;
    Object.assign(listing, updates);
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.params.id });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getCalendar = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });
    res.json(listing.calendarAvailability || []);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateCalendar = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    listing.calendarAvailability = req.body.calendarAvailability;
    await listing.save();
    res.json(listing.calendarAvailability);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 