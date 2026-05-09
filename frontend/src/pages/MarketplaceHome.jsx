import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarketplaceHome = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await axios.get('/api/listings');
      setListings(response.data);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <h1 className="text-4xl font-bold text-center">DIGJAYA Livestock Marketplace</h1>
        <p className="text-center text-blue-100 mt-2">Buy and Sell Livestock with Confidence</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition">
                <img
                  src={listing.image_url}
                  alt={listing.livestock_type}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{listing.livestock_type}</h3>
                  <p className="text-gray-600 text-sm">{listing.breed}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    Rp {listing.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceHome;