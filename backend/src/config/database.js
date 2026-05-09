const { Pool } = require('pg');
const redis = require('redis');

// PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Redis Client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.connect();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  redis: redisClient
};