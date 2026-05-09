import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CheckoutPage = () => {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (orderId && token) {
      fetchOrder();
    }
  }, [orderId, token]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/payments/create-snap-transaction', {
        order_id: orderId,
        amount: order.amount,
        buyer_id: order.buyer_id,
        seller_id: order.seller_id,
        livestock_details: {
          type: order.livestock_type,
          weight: order.weight
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (window.snap) {
        window.snap.pay(response.data.token, {
          onSuccess: () => {
            window.location.href = `/orders/${orderId}`;
          },
          onError: () => {
            alert('Payment failed');
          }
        });
      }
    } catch (err) {
      console.error('Payment creation failed:', err);
      alert('Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-4">Amount: Rp {order.amount.toLocaleString('id-ID')}</p>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Pay Now with Snap'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;