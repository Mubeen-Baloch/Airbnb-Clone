import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListingDetail from '../pages/ListingDetail';
import AuthContext from '../context/AuthContext';

// Mock the API service
jest.mock('../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  connectWebSocket: jest.fn(() => ({
    send: jest.fn(),
    close: jest.fn(),
  })),
}));

// Mock useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'test-listing-id' }),
  useNavigate: () => jest.fn(),
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

const mockUser = {
  _id: 'user-id',
  name: 'Test User',
  email: 'test@example.com',
};

const mockListingWithOwner = {
  _id: 'listing-id',
  title: 'Test Listing',
  description: 'Test Description',
  location: 'Test Location',
  price: 100,
  images: ['image1.jpg'],
  owner: {
    _id: 'owner-id',
    name: 'Owner Name',
  },
  createdAt: '2024-01-01T00:00:00.000Z',
};

const mockListingWithoutOwner = {
  _id: 'listing-id',
  title: 'Test Listing',
  description: 'Test Description',
  location: 'Test Location',
  price: 100,
  images: ['image1.jpg'],
  owner: null, // This was causing the error
  createdAt: '2024-01-01T00:00:00.000Z',
};

const renderWithRouter = (component, user = null) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user, loading: false }}>
        {component}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('ListingDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders listing information correctly', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithOwner });
    api.get.mockResolvedValueOnce({ data: [] }); // calendar
    api.get.mockResolvedValueOnce({ data: [] }); // wishlist

    renderWithRouter(<ListingDetail />, mockUser);

    await waitFor(() => {
      expect(screen.getByText('Test Listing')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
    });
  });

  test('handles listing without owner gracefully', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithoutOwner });
    api.get.mockResolvedValueOnce({ data: [] }); // calendar
    api.get.mockResolvedValueOnce({ data: [] }); // wishlist

    // This should not throw an error
    renderWithRouter(<ListingDetail />, mockUser);

    await waitFor(() => {
      expect(screen.getByText('Test Listing')).toBeInTheDocument();
      expect(screen.getByText('Owner:')).toBeInTheDocument();
    });
  });

  test('shows edit and delete buttons for owner', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithOwner });
    api.get.mockResolvedValueOnce({ data: [] }); // calendar
    api.get.mockResolvedValueOnce({ data: [] }); // wishlist

    renderWithRouter(<ListingDetail />, { ...mockUser, _id: 'owner-id' });

    await waitFor(() => {
      expect(screen.getByText('Edit Listing')).toBeInTheDocument();
      expect(screen.getByText('Delete Listing')).toBeInTheDocument();
    });
  });

  test('does not show edit and delete buttons for non-owner', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithOwner });
    api.get.mockResolvedValueOnce({ data: [] }); // calendar
    api.get.mockResolvedValueOnce({ data: [] }); // wishlist

    renderWithRouter(<ListingDetail />, mockUser);

    await waitFor(() => {
      expect(screen.queryByText('Edit Listing')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Listing')).not.toBeInTheDocument();
    });
  });

  test('handles 404 error gracefully', async () => {
    const api = require('../services/api');
    api.get.mockRejectedValueOnce({ response: { status: 404 } });

    renderWithRouter(<ListingDetail />, mockUser);

    await waitFor(() => {
      expect(screen.getByText('Listing not found')).toBeInTheDocument();
    });
  });

  test('handles network error gracefully', async () => {
    const api = require('../services/api');
    api.get.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<ListingDetail />, mockUser);

    await waitFor(() => {
      expect(screen.getByText('Failed to load listing')).toBeInTheDocument();
    });
  });

  test('displays wishlist button for authenticated users', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithOwner });
    api.get.mockResolvedValueOnce({ data: [] }); // calendar
    api.get.mockResolvedValueOnce({ data: [] }); // wishlist

    renderWithRouter(<ListingDetail />, mockUser);

    await waitFor(() => {
      expect(screen.getByText('Add to Wishlist')).toBeInTheDocument();
    });
  });

  test('does not display wishlist button for unauthenticated users', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithOwner });
    api.get.mockResolvedValueOnce({ data: [] }); // calendar

    renderWithRouter(<ListingDetail />, null);

    await waitFor(() => {
      expect(screen.queryByText('Add to Wishlist')).not.toBeInTheDocument();
    });
  });

  test('displays messaging section for non-owners', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithOwner });
    api.get.mockResolvedValueOnce({ data: [] }); // calendar
    api.get.mockResolvedValueOnce({ data: [] }); // wishlist
    api.get.mockResolvedValueOnce({ data: [] }); // messages

    renderWithRouter(<ListingDetail />, mockUser);

    await waitFor(() => {
      expect(screen.getByText('Message Owner')).toBeInTheDocument();
    });
  });

  test('does not display messaging section for owners', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithOwner });
    api.get.mockResolvedValueOnce({ data: [] }); // calendar
    api.get.mockResolvedValueOnce({ data: [] }); // wishlist

    renderWithRouter(<ListingDetail />, { ...mockUser, _id: 'owner-id' });

    await waitFor(() => {
      expect(screen.queryByText('Message Owner')).not.toBeInTheDocument();
    });
  });

  test('does not display messaging section when owner is null', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithoutOwner });
    api.get.mockResolvedValueOnce({ data: [] }); // calendar
    api.get.mockResolvedValueOnce({ data: [] }); // wishlist

    renderWithRouter(<ListingDetail />, mockUser);

    await waitFor(() => {
      expect(screen.queryByText('Message Owner')).not.toBeInTheDocument();
    });
  });

  test('displays image gallery for listings with images', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithOwner });
    api.get.mockResolvedValueOnce({ data: [] }); // calendar
    api.get.mockResolvedValueOnce({ data: [] }); // wishlist

    renderWithRouter(<ListingDetail />, mockUser);

    await waitFor(() => {
      const image = screen.getByAltText('Test Listing');
      expect(image).toBeInTheDocument();
      expect(image.src).toContain('image1.jpg');
    });
  });

  test('displays calendar availability section', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithOwner });
    api.get.mockResolvedValueOnce({ data: ['2024-01-15', '2024-01-16'] }); // calendar
    api.get.mockResolvedValueOnce({ data: [] }); // wishlist

    renderWithRouter(<ListingDetail />, mockUser);

    await waitFor(() => {
      expect(screen.getByText('Calendar Availability')).toBeInTheDocument();
      expect(screen.getByText('Available Dates: 2024-01-15, 2024-01-16')).toBeInTheDocument();
    });
  });

  test('displays empty calendar message when no dates available', async () => {
    const api = require('../services/api');
    api.get.mockResolvedValueOnce({ data: mockListingWithOwner });
    api.get.mockResolvedValueOnce({ data: [] }); // calendar
    api.get.mockResolvedValueOnce({ data: [] }); // wishlist

    renderWithRouter(<ListingDetail />, mockUser);

    await waitFor(() => {
      expect(screen.getByText('Available Dates: None')).toBeInTheDocument();
    });
  });
}); 