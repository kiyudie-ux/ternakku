-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'buyer',
  kyc_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES users(id),
  livestock_type VARCHAR(100) NOT NULL,
  breed VARCHAR(100),
  weight DECIMAL(10, 2) NOT NULL,
  age_months INT,
  price DECIMAL(15, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  region VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  quantity INT DEFAULT 1,
  price DECIMAL(15, 2) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  order_status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  snap_token TEXT,
  snap_transaction_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Escrow accounts
CREATE TABLE escrow_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'HOLD',
  funds_locked BOOLEAN DEFAULT TRUE,
  dispute_reason TEXT,
  released_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ledger transactions
CREATE TABLE ledger_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  from_account VARCHAR(255) NOT NULL,
  to_account VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Webhook logs
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  midtrans_transaction_id VARCHAR(255) UNIQUE NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  raw_response JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Negotiations
CREATE TABLE negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  initial_price DECIMAL(15, 2) NOT NULL,
  current_offer DECIMAL(15, 2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Negotiation messages
CREATE TABLE negotiation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negotiation_id UUID NOT NULL REFERENCES negotiations(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  offered_price DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_listings_seller ON listings(seller_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_snap_id ON orders(snap_transaction_id);
CREATE INDEX idx_escrow_order ON escrow_accounts(order_id);
CREATE INDEX idx_escrow_status ON escrow_accounts(status);
CREATE INDEX idx_ledger_order ON ledger_transactions(order_id);
CREATE INDEX idx_webhook_trans_id ON webhook_logs(midtrans_transaction_id);