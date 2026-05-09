const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Release escrow funds (after delivery confirmation)
router.post('/release/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const buyerId = req.user.id;

    // Verify buyer is the one confirming delivery
    const order = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND buyer_id = $2',
      [orderId, buyerId]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get escrow details
    const escrow = await db.query(
      'SELECT * FROM escrow_accounts WHERE order_id = $1 AND status = $2',
      [orderId, 'HOLD']
    );

    if (escrow.rows.length === 0) {
      return res.status(400).json({ error: 'No active escrow found' });
    }

    const escrowData = escrow.rows[0];

    // Start transaction
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Release escrow
      await client.query(
        `UPDATE escrow_accounts SET status = $1, released_at = NOW()
         WHERE id = $2`,
        ['RELEASED', escrowData.id]
      );

      // Record ledger: Escrow debit → Seller credit
      await client.query(
        `INSERT INTO ledger_transactions (order_id, from_account, to_account, amount, type, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, 'ESCROW', escrowData.seller_id, escrowData.amount, 'SELLER_CREDIT', 'COMPLETED']
      );

      // Update order status
      await client.query(
        `UPDATE orders SET order_status = $1, completed_at = NOW()
         WHERE id = $2`,
        ['completed', orderId]
      );

      await client.query('COMMIT');

      res.json({ message: 'Funds released to seller', amount: escrowData.amount });

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

  } catch (err) {
    console.error('Escrow release error:', err);
    res.status(500).json({ error: 'Failed to release escrow' });
  }
});

// Freeze escrow (dispute)
router.post('/freeze/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    await db.query(
      `UPDATE escrow_accounts SET status = $1, dispute_reason = $2
       WHERE order_id = $3`,
      ['FROZEN', reason, orderId]
    );

    res.json({ message: 'Escrow frozen for dispute resolution' });

  } catch (err) {
    res.status(500).json({ error: 'Failed to freeze escrow' });
  }
});

module.exports = router;