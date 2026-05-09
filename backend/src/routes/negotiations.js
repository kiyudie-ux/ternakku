const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Create negotiation
router.post('/', auth, async (req, res) => {
  try {
    const { listing_id, initial_price } = req.body;
    const buyerId = req.user.id;

    // Get listing details
    const listing = await db.query('SELECT * FROM listings WHERE id = $1', [listing_id]);
    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const result = await db.query(
      `INSERT INTO negotiations (listing_id, buyer_id, seller_id, initial_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [listing_id, buyerId, listing.rows[0].seller_id, initial_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create negotiation' });
  }
});

// Send negotiation message
router.post('/:negotiationId/messages', auth, async (req, res) => {
  try {
    const { negotiationId } = req.params;
    const { message, offered_price } = req.body;
    const senderId = req.user.id;

    const result = await db.query(
      `INSERT INTO negotiation_messages (negotiation_id, sender_id, message, offered_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [negotiationId, senderId, message, offered_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;