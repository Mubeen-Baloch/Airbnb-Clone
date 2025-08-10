import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the listing data
    api.get(`/listings/${id}`)
      .then(res => {
        const listing = res.data;
        setTitle(listing.title);
        setDescription(listing.description);
        setLocation(listing.location);
        setPrice(listing.price);
        setImages(listing.images || []);
      })
      .catch(() => setError('Failed to load listing'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      let newImageUrl = '';
      if (newImage) {
        const formData = new FormData();
        formData.append('image', newImage);
        const res = await api.post('/listings/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        newImageUrl = res.data.imageUrl;
      }

      const updatedImages = newImageUrl ? [...images, newImageUrl] : images;
      
      await api.put(`/listings/${id}`, {
        title,
        description,
        location,
        price: Number(price),
        images: updatedImages,
      });
      
      navigate(`/listings/${id}`);
    } catch (err) {
      setError('Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-4">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows="4"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        
        {/* Current Images */}
        {images.length > 0 && (
          <div>
            <label className="block mb-2 font-semibold">Current Images:</label>
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Listing ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Add New Image */}
        <div>
          <label className="block mb-2 font-semibold">Add New Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setNewImage(e.target.files[0])}
            className="w-full"
          />
        </div>
        
        {error && <div className="text-red-500">{error}</div>}
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/listings/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListing; 