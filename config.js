module.exports = {
  // Server configuration
  port: process.env.PORT || 3001,
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  
  // Database configuration (for future use)
  database: {
    type: 'in-memory', // 'in-memory', 'json-file', 'sqlite', 'postgresql'
    filePath: './data/database.json' // for json-file type
  },
  
  // API configuration
  api: {
    prefix: '/api',
    version: 'v1'
  },
  
  // Validation rules
  validation: {
    customer: {
      name: { minLength: 2, maxLength: 100 },
      phone: { minLength: 10, maxLength: 15 },
      email: { maxLength: 100 }
    },
    transaction: {
      amount: { min: 0.01, max: 999999.99 },
      description: { maxLength: 500 }
    }
  },
  
  // Sample data configuration
  sampleData: {
    enabled: true,
    customers: 2,
    transactions: 2
  }
}; 