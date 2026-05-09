# DIGJAYA - Digital Livestock Marketplace Platform

A production-ready digital livestock trading ecosystem with escrow payment system, AI pricing engine, negotiation system, and complete transaction tracking.

## 🏗️ Architecture Overview

```
Frontend (React + Mobile)
    ↓
Backend API (Node.js/Express)
    ↓
Midtrans Snap Payment Gateway
    ↓
Webhook Handler (Payment Status)
    ↓
Internal Escrow Engine
    ↓
Ledger System (Transaction Recording)
    ↓
Payout System (Seller Settlement)
```

## 📦 Core Components

### 1. **Payment System (Midtrans Snap ONLY)**
- Snap API for all transactions
- Server-side transaction generation
- Webhook-based payment confirmation
- Client key for frontend, Server key for backend

### 2. **Escrow Engine (Internal)**
- Payment holding system
- Status: HOLD → RELEASED/FROZEN
- Dispute management
- Automatic fund release on delivery confirmation

### 3. **Ledger System**
- Double-entry accounting
- Transaction audit trail
- Buyer debit → Escrow credit
- Escrow debit → Seller credit

### 4. **AI Systems**
- AI Pricing Engine (market price suggestions)
- AI Negotiation Assistant (counter-offer suggestions)
- Market trend analysis

### 5. **Admin Dashboard**
- Transaction overview
- Escrow monitoring
- Dispute management
- Market analytics

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
PostgreSQL 14+
Redis (optional, for caching)
Midtrans Account (Server Key + Client Key)
```

### Installation

```bash
# Clone repository
git clone https://github.com/kiyudie-ux/ternakku.git
cd ternakku

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run migrations
npm run migrate

# Start services
docker-compose up -d
npm run dev
```

## 📋 Project Structure

```
ternakku/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── app.js
│   ├── migrations/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
├── admin-dashboard/
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔐 Security

- ✅ Midtrans webhook signature verification
- ✅ Server-side transaction validation
- ✅ Idempotent webhook processing
- ✅ Escrow fund protection
- ✅ Encrypted sensitive data
- ✅ Rate limiting & DDoS protection

## 📊 Transaction Flow

1. Buyer selects livestock
2. AI suggests fair market price
3. Buyer negotiates (optional)
4. Payment initiated → Midtrans Snap
5. User completes payment
6. Webhook confirms settlement
7. Escrow activated (funds held)
8. Seller delivers livestock
9. Buyer confirms delivery
10. Funds released to seller wallet

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL (Primary database)
- Redis (Caching)
- Midtrans SDK
- JWT Authentication

**Frontend:**
- React 18+
- TailwindCSS
- Redux (State management)
- Axios (API client)
- Socket.io (Real-time chat)

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- AWS/GCP Ready

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Submit Pull Request

## 📞 Support

For issues and questions, create an issue on GitHub or contact: support@digjaya.id

## 📄 License

MIT License - See LICENSE file for details

---

**DIGJAYA v1.0.0** - Production Ready 🚀