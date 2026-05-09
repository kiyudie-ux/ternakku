const crypto = require('crypto');

const verifyMidtransSignature = (req, res, next) => {
  const { order_id, status_code, gross_amount } = req.body;
  const signature = req.body.signature_key;
  
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const data = `${order_id}${status_code}${gross_amount}${serverKey}`;
  const hash = crypto.createHash('sha512').update(data).digest('hex');

  if (hash !== signature) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  next();
};

module.exports = { verifyMidtransSignature };