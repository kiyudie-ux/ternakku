const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, phone, role, kyc_verified, avatar_url, bio, location FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, bio, location, avatar_url } = req.body;
    const result = await db.query(
      `UPDATE users SET name = $1, phone = $2, bio = $3, location = $4, avatar_url = $5
       WHERE id = $6 RETURNING *`,
      [name, phone, bio, location, avatar_url, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;