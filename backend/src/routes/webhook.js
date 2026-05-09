const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyMidtransSignature } = require('../middleware/webhook');
const crypto = require('crypto');

// CRITICAL: Midtrans Webhook Handler
router.post('/midtrans', verifyMidtransSignature, async (req, res) => {
  try {
    const {
      order_id,
      transaction_status,
      payment_type,
      transaction_id,
      gross_amount,
      fraud_status
    } = req.body;

    // Prevent duplicate processing (idempotency)
    const existingWebhook = await db.query(
      'SELECT * FROM webhook_logs WHERE midtrans_transaction_id = $1',
      [transaction_id]
    );

    if (existingWebhook.rows.length > 0) {
      return res.status(200).json({ message: 'Webhook already processed' });
    }

    let paymentStatus = 'pending';
    let orderStatus = 'waiting_payment';

    if (transaction_status === 'settlement') {
      paymentStatus = 'settlement';
      orderStatus = 'paid';
    } else if (transaction_status === 'pending') {
      paymentStatus = 'pending';
      orderStatus = 'waiting_payment';
    } else if (transaction_status === 'cancel' || transaction_status === 'expire') {
      paymentStatus = 'failed';
      orderStatus = 'payment_failed';
    }

    // Start transaction
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Update order status
      await client.query(
        `UPDATE orders SET payment_status = $1, order_status = $2, updated_at = NOW()
         WHERE snap_transaction_id = $3`,
        [paymentStatus, orderStatus, order_id]
      );

      // Get order details for escrow activation
      const orderResult = await client.query(
        'SELECT id, buyer_id, seller_id, amount FROM orders WHERE snap_transaction_id = $1',
        [order_id]
      );

      const order = orderResult.rows[0];

      // CRITICAL: Activate escrow if payment settled
      if (paymentStatus === 'settlement') {
        // Create escrow record
        await client.query(
          `INSERT INTO escrow_accounts (order_id, buyer_id, seller_id, amount, status, funds_locked)
           VALUES ($1, $2, $3, $4, 'HOLD', true)`,
          [order.id, order.buyer_id, order.seller_id, order.amount]
        );

        // Record ledger transaction: Buyer debit → Escrow credit
        await client.query(
          `INSERT INTO ledger_transactions (order_id, from_account, to_account, amount, type, status)
           VALUES ($1, $2, $3, $4, 'BUYER_DEBIT', 'COMPLETED')`,
          [order.id, order.buyer_id, 'ESCROW', order.amount]
        );
      }

      // Log webhook
      await client.query(
        `INSERT INTO webhook_logs (midtrans_transaction_id, order_id, status, raw_response)
         VALUES ($1, $2, $3, $4)`,
        [transaction_id, order_id, paymentStatus, JSON.stringify(req.body)]
      );

      await client.query('COMMIT');

      res.status(200).json({ success: true, message: 'Webhook processed' });

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;