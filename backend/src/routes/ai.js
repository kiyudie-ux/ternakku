const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Get AI suggested price
router.get('/pricing/suggest', async (req, res) => {
  try {
    const { livestock_type, weight, region } = req.query;

    // Get average price for similar livestock
    const result = await db.query(
      `SELECT AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price
       FROM listings
       WHERE livestock_type = $1 AND region = $2 AND status = 'active'`,
      [livestock_type, region]
    );

    const avgPrice = result.rows[0].avg_price || 0;
    const minPrice = result.rows[0].min_price || 0;
    const maxPrice = result.rows[0].max_price || 0;

    // Simple AI: suggest price based on weight and average
    const suggestedPrice = avgPrice * (weight / 100) || avgPrice;

    res.json({
      suggested_price: Math.round(suggestedPrice),
      min_price: minPrice,
      max_price: maxPrice,
      avg_price: avgPrice
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get price suggestion' });
  }
});

module.exports = router;