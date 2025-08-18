# Backend Project Structure

## Overview
This backend provides a RESTful API for managing customer accounts and transactions using Node.js, Express, and an in-memory/JSON file database system.

## Directory Structure
```
backend/
├── data/                          # Data storage
│   ├── database.json             # JSON database file
│   └── backup/                   # Backup files directory
│       └── .gitkeep
├── utils/                         # Utility modules
│   └── database.js               # Database management class
├── server.js                      # Basic Express server
├── server-enhanced.js             # Enhanced server with validation & persistence
├── config.js                      # Configuration settings
├── test-api.js                    # API testing script
├── package.json                   # Dependencies and scripts
├── README.md                      # API documentation
├── PROJECT_STRUCTURE.md           # This file
└── .gitignore                     # Git ignore rules
```

## Key Files

### Core Servers
- **`server.js`** - Basic Express server with in-memory database
- **`server-enhanced.js`** - Enhanced server with validation, persistence, and better error handling

### Database & Data
- **`utils/database.js`** - Database class handling both in-memory and JSON file storage
- **`data/database.json`** - JSON file for persistent data storage
- **`data/backup/`** - Directory for automated backups

### Configuration & Testing
- **`config.js`** - Centralized configuration for server, database, and validation
- **`test-api.js`** - Comprehensive API testing script
- **`package.json`** - Project dependencies and npm scripts

## Features

### Basic Server (`server.js`)
- ✅ Express server setup
- ✅ CORS enabled
- ✅ Basic CRUD operations
- ✅ In-memory data storage
- ✅ Sample data initialization

### Enhanced Server (`server-enhanced.js`)
- ✅ All basic features
- ✅ Input validation
- ✅ JSON file persistence
- ✅ Request logging
- ✅ Enhanced error handling
- ✅ Health check endpoint
- ✅ Backup functionality
- ✅ Graceful shutdown
- ✅ Better API documentation

### Database System
- ✅ In-memory storage (default)
- ✅ JSON file persistence (configurable)
- ✅ Automatic data saving
- ✅ Backup and restore functionality
- ✅ Sample data initialization

## API Endpoints

### Core Endpoints
- `GET /` - Health check
- `GET /api/health` - Detailed health status (enhanced only)
- `GET /api/dashboard` - Dashboard statistics
- `POST /api/backup` - Create database backup (enhanced only)

### Customer Management
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Transaction Management
- `GET /api/transactions` - List transactions (with filters)
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Financial Operations
- `GET /api/customers/:id/balance` - Get customer balance and summary

## Configuration Options

### Database Types
- `in-memory` - Data stored in memory (resets on restart)
- `json-file` - Data persisted to JSON file

### Validation Rules
- Customer name: 2-100 characters
- Phone: 10-15 characters
- Email: max 100 characters
- Transaction amount: 0.01 - 999,999.99
- Transaction description: max 500 characters

## Usage

### Development
```bash
# Basic server
npm run dev

# Enhanced server
npm run dev:enhanced
```

### Production
```bash
# Basic server
npm start

# Enhanced server
npm run start:enhanced
```

### Testing
```bash
# Test API endpoints
npm test

# Create backup
npm run backup
```

## Data Models

### Customer
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### Transaction
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "type": "credit|debit",
  "amount": "number",
  "description": "string",
  "date": "ISO date",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

## Security & Best Practices

- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ Request logging
- ✅ Graceful shutdown
- ✅ Data persistence
- ✅ Backup functionality

## Future Enhancements

- 🔄 SQLite database support
- 🔄 PostgreSQL database support
- 🔄 Authentication & authorization
- 🔄 Rate limiting
- 🔄 API versioning
- 🔄 Swagger documentation
- 🔄 Unit tests
- 🔄 Docker support
- 🔄 Environment-specific configs 