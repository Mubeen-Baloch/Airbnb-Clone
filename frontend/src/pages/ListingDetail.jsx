import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { connectWebSocket } from '../services/api';

const ReviewSection = ({ listingId, user, isOwner }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  const fetchReviews = () => {
    api.get(`/listings/${listingId}/reviews`)
      .then(res => setReviews(res.data))
      .catch(() => setError('Failed to load reviews'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [listingId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/listings/${listingId}/reviews`, { rating, comment });
      setRating(5);
      setComment('');
      fetchReviews();
    } catch {
      setError('Failed to add review');
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/listings/${listingId}/reviews/${editingId}`, { rating: editRating, comment: editComment });
      setEditingId(null);
      fetchReviews();
    } catch {
      setError('Failed to update review');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/listings/${listingId}/reviews/${id}`);
      fetchReviews();
    } catch {
      setError('Failed to delete review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const userReview = user && reviews.find(r => r.user._id === user._id);
  const avgRating = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-2">Reviews {avgRating && <span className="text-yellow-500">★ {avgRating}</span>}</h2>
      {user && !userReview && !isOwner && (
        <form onSubmit={handleAdd} className="mb-4 flex flex-col gap-2">
          <div>
            <label>Rating: </label>
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <textarea
            placeholder="Write a review..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-32">Add Review</button>
        </form>
      )}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review._id} className="bg-gray-100 p-3 rounded">
            <div className="flex items-center gap-2">
              <span className="font-bold">{review.user.name}</span>
              <span className="text-yellow-500">★ {review.rating}</span>
            </div>
            {editingId === review._id ? (
              <form onSubmit={handleUpdate} className="flex flex-col gap-2 mt-2">
                <div>
                  <label>Edit Rating: </label>
                  <select value={editRating} onChange={e => setEditRating(Number(e.target.value))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <textarea
                  value={editComment}
                  onChange={e => setEditComment(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="mt-1">{review.comment}</div>
            )}
            {user && review.user._id === user._id && editingId !== review._id && (
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(review)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(review._id)} className="text-red-600">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [calendar, setCalendar] = useState([]);
  const [calendarInput, setCalendarInput] = useState('');
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState(null);
  const [calendarSaving, setCalendarSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [ws, setWs] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guests, setGuests] = useState([]);

  const fetchCalendar = useCallback(() => {
    setCalendarLoading(true);
    api.get(`/listings/${id}/calendar`)
      .then(res => setCalendar(res.data))
      .catch(() => setCalendarError('Failed to load calendar'))
      .finally(() => setCalendarLoading(false));
  }, [id]);

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then(res => setListing(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setError('Listing not found');
        } else {
          setError('Failed to load listing');
        }
      })
      .finally(() => setLoading(false));
    fetchCalendar();
  }, [id, fetchCalendar]);

  useEffect(() => {
    if (user) {
      api.get('/users/wishlist').then(res => {
        const wishlistIds = res.data.map(l => l._id);
        setIsWishlisted(wishlistIds.includes(id));
      });
    }
  }, [user, id]);

  const fetchOwnerMessages = async (guestId = null) => {
    try {
      let url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/messages/listing/${id}/owner`;
      if (guestId) {
        url += `?guestId=${guestId}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        
        // If no specific guest is requested, extract unique guests from all messages
        if (!guestId) {
          const uniqueGuests = [];
          data.forEach(msg => {
            const otherUser = msg.sender._id === user._id ? msg.recipient : msg.sender;
            if (!uniqueGuests.find(g => g._id === otherUser._id)) {
              uniqueGuests.push(otherUser);
            }
          });
          setGuests(uniqueGuests);
          
          // Set first guest as selected by default
          if (uniqueGuests.length > 0 && !selectedGuest) {
            setSelectedGuest(uniqueGuests[0]._id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching owner messages:', err);
    }
  };

  const fetchGuestMessages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/messages/listing/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching guest messages:', err);
    }
  };

  // Fetch messages based on user role and selected guest
  useEffect(() => {
    if (user && listing && listing.owner) {
      const isOwner = user._id === listing.owner._id;
      if (isOwner) {
        if (selectedGuest) {
          // Fetch conversation with specific guest
          fetchOwnerMessages(selectedGuest);
        } else {
          // Fetch all messages to populate guest list
          fetchOwnerMessages();
        }
      } else {
        fetchGuestMessages();
      }
    }
  }, [user, listing, selectedGuest]);

  useEffect(() => {
    if (!user || !listing || !listing.owner) return;
    
    // WebSocket
    const socket = connectWebSocket(localStorage.getItem('token'), (msg) => {
      if (msg.listing === listing._id) {
        setMessages((prev) => [...prev, msg]);
        
        // If owner receives a message, update guests list
        if (user._id === listing.owner._id && msg.sender._id !== user._id) {
          setGuests(prev => {
            if (!prev.find(g => g._id === msg.sender._id)) {
              return [...prev, msg.sender];
            }
            return prev;
          });
        }
      }
    });
    setWs(socket);
    return () => socket.close();
  }, [user, listing]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setDeleting(true);
    try {
      await api.delete(`/listings/${id}`);
      navigate('/my-listings');
    } catch {
      setError('Failed to delete listing');
    } finally {
      setDeleting(false);
    }
  };

  const handleWishlist = async () => {
    if (!listing) return;
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await api.delete(`/users/wishlist/${listing._id}`);
        setIsWishlisted(false);
      } else {
        await api.post(`/users/wishlist/${listing._id}`);
        setIsWishlisted(true);
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleCalendarSave = async () => {
    setCalendarSaving(true);
    try {
      const dates = calendarInput.split(',').map(d => d.trim()).filter(Boolean);
      await api.put(`/listings/${id}/calendar`, { calendarAvailability: dates });
      setCalendarInput('');
      fetchCalendar();
    } finally {
      setCalendarSaving(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !ws) return;
    
    let recipient;
    if (isOwner) {
      // Owner sending to selected guest
      if (!selectedGuest) return;
      recipient = selectedGuest;
    } else {
      // Guest sending to owner
      if (!listing.owner) return;
      recipient = listing.owner._id;
    }
    
    ws.send(
      JSON.stringify({
        token: localStorage.getItem('token'),
        recipient: recipient,
        content: messageInput,
        listing: listing._id,
      })
    );
    setMessageInput('');
  };

  // Filter messages based on selected guest (for owners)
  const getFilteredMessages = () => {
    if (!isOwner || !selectedGuest) {
      return messages;
    }
    return messages.filter(msg => 
      (msg.sender._id === selectedGuest && msg.recipient._id === user._id) ||
      (msg.sender._id === user._id && msg.recipient._id === selectedGuest)
    );
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!listing) return null;

  const isOwner = user && listing.owner && user._id === listing.owner._id;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      {listing.images && listing.images.length > 0 && (
        <div className="mb-4">
          <img 
            src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${listing.images[currentImageIndex]}`}
            alt={listing.title} 
            className="w-full h-64 object-cover rounded"
            onError={(e) => {
              e.target.style.display = 'none';
              console.error('Failed to load image:', listing.images[currentImageIndex]);
            }}
          />
          {listing.images.length > 1 && (
            <div className="flex justify-center mt-2 space-x-2">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <p className="mb-2"><strong>Location:</strong> {listing.location}</p>
      <p className="mb-2"><strong>Price:</strong> ${listing.price}</p>
      <p className="mb-2"><strong>Description:</strong> {listing.description}</p>
      <p className="mb-2"><strong>Owner:</strong> {listing.owner?.name}</p>
      {isOwner && (
        <div className="flex space-x-2 mt-4">
          <Link
            to={`/edit-listing/${id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Listing
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Listing'}
          </button>
        </div>
      )}
      {user && !isOwner && (
        <button
          onClick={handleWishlist}
          className={`ml-2 px-4 py-2 rounded ${isWishlisted ? 'bg-yellow-400 text-black' : 'bg-gray-200'}`}
          disabled={wishlistLoading}
        >
          {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </button>
      )}
      {/* Calendar Availability Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Calendar Availability</h2>
        {calendarLoading ? (
          <div>Loading calendar...</div>
        ) : calendarError ? (
          <div className="text-red-500">{calendarError}</div>
        ) : (
          <div>
            <div className="mb-2">Available Dates: {calendar.length ? calendar.join(', ') : 'None'}</div>
            {isOwner && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <input
                    type="date"
                    id="datePicker"
                    className="border p-2 rounded"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const dateInput = document.getElementById('datePicker');
                      if (dateInput.value) {
                        setCalendarInput(prev => 
                          prev ? `${prev}, ${dateInput.value}` : dateInput.value
                        );
                        dateInput.value = '';
                      }
                    }}
                    className="bg-green-600 text-white px-3 py-2 rounded"
                  >
                    Add Date
                  </button>
                </div>
                {calendarInput && (
                  <div className="text-sm text-gray-600">
                    Selected dates: {calendarInput}
                  </div>
                )}
                <button
                  onClick={handleCalendarSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-40"
                  disabled={calendarSaving}
                >
                  {calendarSaving ? 'Saving...' : 'Save Availability'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Messaging Section */}
      {user && listing.owner && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">
            {isOwner ? 'Messages from Guests' : 'Message Owner'}
          </h2>
          
          {/* Guest selector for owners */}
          {isOwner && guests.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Guest:</label>
              <select 
                value={selectedGuest || ''} 
                onChange={(e) => setSelectedGuest(e.target.value)}
                className="border p-2 rounded w-full"
              >
                {guests.map(guest => (
                  <option key={guest._id} value={guest._id}>
                    {guest.name || `Guest ${guest._id.slice(-4)}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="bg-gray-100 p-4 rounded mb-2 max-h-64 overflow-y-auto">
            {getFilteredMessages().map((msg) => (
              <div key={msg._id} className={`mb-2 ${msg.sender._id === user._id ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-2 py-1 rounded ${msg.sender._id === user._id ? 'bg-blue-200' : 'bg-gray-300'}`}>
                  <div className="text-xs text-gray-600 mb-1">
                    {msg.sender._id === user._id ? 'You' : msg.sender.name}
                  </div>
                  {msg.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          
          {/* Message input form - now available for both owners and guests */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              className="border p-2 rounded flex-1"
              placeholder={isOwner ? "Reply to guest..." : "Type your message..."}
            />
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded" 
              type="submit"
              disabled={isOwner && !selectedGuest}
            >
              Send
            </button>
          </form>
        </div>
      )}
             <ReviewSection listingId={id} user={user} isOwner={isOwner} />
    </div>
  );
};

export default ListingDetail; 