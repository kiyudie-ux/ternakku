const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Get all listings (public)
router.get('/', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, region } = req.query;
    let query = 'SELECT l.*, u.name as seller_name FROM listings l JOIN users u ON l.seller_id = u.id WHERE l.status = $1';
    const params = ['active'];

    if (type) {
      query += ' AND l.livestock_type = $' + (params.length + 1);
      params.push(type);
    }
    if (minPrice) {
      query += ' AND l.price >= $' + (params.length + 1);
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND l.price <= $' + (params.length + 1);
      params.push(maxPrice);
    }
    if (region) {
      query += ' AND l.region = $' + (params.length + 1);
      params.push(region);
    }

    query += ' ORDER BY l.created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Create listing
router.post('/', auth, async (req, res) => {
  try {
    const { livestock_type, breed, weight, age_months, price, description, image_url, region } = req.body;
    const sellerId = req.user.id;

    const result = await db.query(
      `INSERT INTO listings (seller_id, livestock_type, breed, weight, age_months, price, description, image_url, region)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [sellerId, livestock_type, breed, weight, age_months, price, description, image_url, region]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

module.module = router;