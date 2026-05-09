const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth, adminOnly } = require('../middleware/auth');

// Get ledger for order
router.get('/order/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await db.query(
      'SELECT * FROM ledger_transactions WHERE order_id = $1 ORDER BY created_at DESC',
      [orderId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ledger' });
  }
});

// Admin: View all ledger
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM ledger_transactions ORDER BY created_at DESC LIMIT 1000'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ledger' });
  }
});

module.exports = router;