# Naveenbook Backend API

A Node.js and Express backend API for managing customer accounts and transactions with an in-memory JSON database. Ready for deployment on Vercel with Git integration.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/naveenbook-backend)

**For detailed deployment instructions, see:**
- [Quick Deploy Guide](QUICK_DEPLOY.md)
- [Full Deployment Guide](DEPLOYMENT.md)

## Features

- Customer management (CRUD operations)
- Transaction management (CRUD operations)
- Customer balance calculation
- Dashboard summary with statistics
- In-memory data storage
- RESTful API design
- CORS enabled for frontend integration

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd naveenbook_Backend_API
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Basic server mode
npm run start:basic
```

The server will start on port 3001 by default. You can change this by setting the `PORT` environment variable.

## 🚀 Deployment

### Quick Deploy to Vercel
```bash
# Run the automated deployment script
./deploy.sh          # Linux/Mac
deploy.bat           # Windows
```

### Manual Deployment
1. Push your code to Git repository
2. Connect to Vercel dashboard
3. Import your repository
4. Deploy with Node.js framework preset

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## API Endpoints

### Base URL
```
http://localhost:3001
```

### Health Check
- **GET** `/` - Check if API is running

### Customers

- **GET** `/api/customers` - Get all customers
- **GET** `/api/customers/:id` - Get customer by ID
- **POST** `/api/customers` - Create new customer
- **PUT** `/api/customers/:id` - Update customer
- **DELETE** `/api/customers/:id` - Delete customer

### Transactions

- **GET** `/api/transactions` - Get all transactions (with optional filters)
- **GET** `/api/transactions/:id` - Get transaction by ID
- **POST** `/api/transactions` - Create new transaction
- **PUT** `/api/transactions/:id` - Update transaction
- **DELETE** `/api/transactions/:id` - Delete transaction

### Customer Balance

- **GET** `/api/customers/:id/balance` - Get customer balance and transaction summary

### Dashboard

- **GET** `/api/dashboard` - Get dashboard summary with statistics

## Data Models

### Customer
```json
{
  "id": "uuid",
  "name": "string (required)",
  "phone": "string (required)",
  "email": "string (optional)",
  "address": "string (optional)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Transaction
```json
{
  "id": "uuid",
  "customerId": "uuid (required)",
  "type": "credit|debit (required)",
  "amount": "number (required, > 0)",
  "description": "string (optional)",
  "date": "ISO date string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## Query Parameters

### Transactions Filtering
- `customerId` - Filter by customer ID
- `type` - Filter by transaction type (credit/debit)
- `startDate` - Filter transactions from this date
- `endDate` - Filter transactions until this date

Example:
```
GET /api/transactions?customerId=123&type=credit&startDate=2024-01-01
```

## Sample Requests

### Create Customer
```bash
curl -X POST http://localhost:3001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "address": "123 Main St"
  }'
```

### Create Transaction
```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer-uuid-here",
    "type": "credit",
    "amount": 1000,
    "description": "Payment received"
  }'
```

### Get Customer Balance
```bash
curl http://localhost:3001/api/customers/customer-uuid-here/balance
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Development

The backend uses nodemon for development, which automatically restarts the server when files change.

## Notes

- Data is stored in memory and will be reset when the server restarts
- Sample data is automatically initialized on server start
- All dates are stored in ISO format
- UUIDs are used for all IDs to ensure uniqueness
- CORS is enabled for frontend integration 