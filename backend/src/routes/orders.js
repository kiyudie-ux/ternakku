const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { listing_id, seller_id, quantity, negotiated_price } = req.body;
    const buyerId = req.user.id;

    // Validate listing
    const listing = await db.query(
      'SELECT * FROM listings WHERE id = $1',
      [listing_id]
    );

    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const price = negotiated_price || listing.rows[0].price;
    const totalAmount = price * quantity;

    // Create order
    const result = await db.query(
      `INSERT INTO orders (listing_id, buyer_id, seller_id, quantity, price, amount, order_status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [listing_id, buyerId, seller_id, quantity, price, totalAmount, 'pending', 'unpaid']
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by ID
router.get('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await db.query(
      `SELECT o.*, l.livestock_type, l.weight, l.image_url, u.name as seller_name
       FROM orders o
       JOIN listings l ON o.listing_id = l.id
       JOIN users u ON o.seller_id = u.id
       WHERE o.id = $1`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;