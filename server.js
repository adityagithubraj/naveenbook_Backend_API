const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory database
let customers = [];
let transactions = [];

// Initialize with some sample data
const initializeData = () => {
  if (customers.length === 0) {
    customers = [
      {
        id: uuidv4(),
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        address: '123 Main St, City, State',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Jane Smith',
        phone: '+0987654321',
        email: 'jane@example.com',
        address: '456 Oak Ave, Town, State',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  if (transactions.length === 0) {
    transactions = [
      {
        id: uuidv4(),
        customerId: customers[0].id,
        type: 'credit',
        amount: 1000,
        description: 'Initial payment',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        customerId: customers[1].id,
        type: 'debit',
        amount: 500,
        description: 'Service charge',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
};

// Initialize data on server start
initializeData();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'My Accounts Lite API is running!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Customer routes
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.get('/api/customers/:id', (req, res) => {
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
});

app.post('/api/customers', (req, res) => {
  const { name, phone, email, address } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const newCustomer = {
    id: uuidv4(),
    name,
    phone,
    email: email || '',
    address: address || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

app.put('/api/customers/:id', (req, res) => {
  const customerIndex = customers.findIndex(c => c.id === req.params.id);
  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const { name, phone, email, address } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  customers[customerIndex] = {
    ...customers[customerIndex],
    name,
    phone,
    email: email || '',
    address: address || '',
    updatedAt: new Date().toISOString()
  };

  res.json(customers[customerIndex]);
});

app.delete('/api/customers/:id', (req, res) => {
  const customerIndex = customers.findIndex(c => c.id === req.params.id);
  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  // Remove all transactions for this customer
  transactions = transactions.filter(t => t.customerId !== req.params.id);
  
  // Remove customer
  customers.splice(customerIndex, 1);
  
  res.json({ message: 'Customer deleted successfully' });
});

// Transaction routes
app.get('/api/transactions', (req, res) => {
  const { customerId, type, startDate, endDate } = req.query;
  
  let filteredTransactions = [...transactions];
  
  if (customerId) {
    filteredTransactions = filteredTransactions.filter(t => t.customerId === customerId);
  }
  
  if (type) {
    filteredTransactions = filteredTransactions.filter(t => t.type === type);
  }
  
  if (startDate) {
    filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= new Date(startDate));
  }
  
  if (endDate) {
    filteredTransactions = filteredTransactions.filter(t => new Date(t.date) <= new Date(endDate));
  }
  
  res.json(filteredTransactions);
});

app.get('/api/transactions/:id', (req, res) => {
  const transaction = transactions.find(t => t.id === req.params.id);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.json(transaction);
});

app.post('/api/transactions', (req, res) => {
  const { customerId, type, amount, description, date } = req.body;
  
  if (!customerId || !type || !amount) {
    return res.status(400).json({ error: 'Customer ID, type, and amount are required' });
  }

  // Check if customer exists
  const customer = customers.find(c => c.id === customerId);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  if (!['credit', 'debit'].includes(type)) {
    return res.status(400).json({ error: 'Type must be either "credit" or "debit"' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  const newTransaction = {
    id: uuidv4(),
    customerId,
    type,
    amount,
    description: description || '',
    date: date || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

app.put('/api/transactions/:id', (req, res) => {
  const transactionIndex = transactions.findIndex(t => t.id === req.params.id);
  if (transactionIndex === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const { customerId, type, amount, description, date } = req.body;
  
  if (!customerId || !type || !amount) {
    return res.status(400).json({ error: 'Customer ID, type, and amount are required' });
  }

  // Check if customer exists
  const customer = customers.find(c => c.id === customerId);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  if (!['credit', 'debit'].includes(type)) {
    return res.status(400).json({ error: 'Type must be either "credit" or "debit"' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  transactions[transactionIndex] = {
    ...transactions[transactionIndex],
    customerId,
    type,
    amount,
    description: description || '',
    date: date || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.json(transactions[transactionIndex]);
});

app.delete('/api/transactions/:id', (req, res) => {
  const transactionIndex = transactions.findIndex(t => t.id === req.params.id);
  if (transactionIndex === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  transactions.splice(transactionIndex, 1);
  res.json({ message: 'Transaction deleted successfully' });
});

// Customer balance route
app.get('/api/customers/:id/balance', (req, res) => {
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const customerTransactions = transactions.filter(t => t.customerId === req.params.id);
  
  const balance = customerTransactions.reduce((total, transaction) => {
    if (transaction.type === 'credit') {
      return total + transaction.amount;
    } else {
      return total - transaction.amount;
    }
  }, 0);

  res.json({
    customerId: req.params.id,
    customerName: customer.name,
    balance: balance,
    totalCredits: customerTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0),
    totalDebits: customerTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0),
    transactionCount: customerTransactions.length
  });
});

// Dashboard summary route
app.get('/api/dashboard', (req, res) => {
  const totalCustomers = customers.length;
  const totalTransactions = transactions.length;
  
  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netBalance = totalCredits - totalDebits;
  
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(t => {
      const customer = customers.find(c => c.id === t.customerId);
      return {
        ...t,
        customerName: customer ? customer.name : 'Unknown'
      };
    });

  res.json({
    totalCustomers,
    totalTransactions,
    totalCredits,
    totalDebits,
    netBalance,
    recentTransactions
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    customers: customers.length,
    transactions: transactions.length
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}`);
    console.log(`Dashboard: http://localhost:${PORT}/api/dashboard`);
  });
}

// Export for Vercel
module.exports = app; 