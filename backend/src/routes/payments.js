const express = require('express');
const router = express.Router();
const snap = require('../config/midtrans');
const db = require('../config/database');
const { auth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Create Snap transaction (CRITICAL: Server-side only)
router.post('/create-snap-transaction', auth, async (req, res) => {
  try {
    const { order_id, amount, buyer_id, seller_id, livestock_details } = req.body;

    // Validate order exists
    const orderCheck = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND buyer_id = $2',
      [order_id, buyer_id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Generate unique Snap transaction
    const transactionId = `DIGJAYA-${uuidv4()}`;

    const snapParameter = {
      transaction_details: {
        order_id: transactionId,
        gross_amount: amount
      },
      customer_details: {
        email: req.user.email,
        phone: req.user.phone,
        first_name: req.user.name
      },
      item_details: [{
        id: order_id,
        price: amount,
        quantity: 1,
        name: `${livestock_details.type} - ${livestock_details.weight}kg`
      }],
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/orders/${order_id}`,
        error: `${process.env.FRONTEND_URL}/payment-error`,
        pending: `${process.env.FRONTEND_URL}/payment-pending`
      }
    };

    const transaction = await snap.createTransaction(snapParameter);

    // Store transaction reference
    await db.query(
      `UPDATE orders SET snap_token = $1, snap_transaction_id = $2, payment_status = 'pending' 
       WHERE id = $3`,
      [transaction.token, transactionId, order_id]
    );

    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: transactionId
    });

  } catch (err) {
    console.error('Snap creation error:', err);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

module.exports = router;