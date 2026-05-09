const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth, adminOnly } = require('../middleware/auth');

// Dashboard overview
router.get('/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const totalOrders = await db.query('SELECT COUNT(*) as count FROM orders');
    const totalRevenue = await db.query('SELECT SUM(amount) as total FROM orders WHERE order_status = $1', ['completed']);
    const totalEscrowFunds = await db.query('SELECT SUM(amount) as total FROM escrow_accounts WHERE status = $1', ['HOLD']);
    const failedTransactions = await db.query('SELECT COUNT(*) as count FROM orders WHERE order_status = $1', ['payment_failed']);

    res.json({
      totalOrders: totalOrders.rows[0].count,
      totalRevenue: totalRevenue.rows[0].total || 0,
      escrowFunds: totalEscrowFunds.rows[0].total || 0,
      failedTransactions: failedTransactions.rows[0].count
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// List all transactions
router.get('/transactions', auth, adminOnly, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT o.*, u.name as buyer_name, s.name as seller_name, l.livestock_type
       FROM orders o
       JOIN users u ON o.buyer_id = u.id
       JOIN users s ON o.seller_id = s.id
       JOIN listings l ON o.listing_id = l.id
       ORDER BY o.created_at DESC
       LIMIT 100`
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;