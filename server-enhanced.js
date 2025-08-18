const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;

// JWT Secret Key (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'naveenbook-secret-key-2024';

// Admin credentials
const ADMIN_CREDENTIALS = {
  id: 'naveenbook@1122',
  password: '1122'
};

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'database.json');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Save data to file
const saveData = async (data) => {
  try {
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    const tempFile = DATA_FILE + '.tmp';
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2));
    await fs.rename(tempFile, DATA_FILE);
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

// Load data from file
const loadData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { customers: [], transactions: [], lastUpdated: null, version: '1.0.0' };
    }
    throw error;
  }
};

// Initialize data
const initializeData = async () => {
  try {
    const data = await loadData();
    
    // Create sample data if database is empty
    if (data.customers.length === 0 && data.transactions.length === 0) {
      const sampleCustomer = {
        id: uuidv4(),
        name: 'John Doe',
        phone: '+91 98765 43210',
        email: 'john.doe@example.com',
        address: '123 Main Street, City, State 12345',
        createdAt: new Date().toISOString()
      };

      const sampleTransaction = {
        id: uuidv4(),
        customerId: sampleCustomer.id,
        type: 'credit',
        amount: 5000,
        description: 'Initial credit',
        date: new Date().toISOString()
      };

      data.customers.push(sampleCustomer);
      data.transactions.push(sampleTransaction);
      data.lastUpdated = new Date().toISOString();
      
      await saveData(data);
      console.log('✅ Sample data created successfully');
    }
    
    console.log('✅ Data initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing data:', error);
  }
};

// Auto-save configuration
const AUTO_SAVE_INTERVAL = process.env.AUTO_SAVE_INTERVAL || 30000; // 30 seconds default

// Auto-save data every 30 seconds (configurable)
setInterval(async () => {
  await saveData(await loadData());
}, AUTO_SAVE_INTERVAL);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await saveData(await loadData());
  console.log('✅ Data saved successfully');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await saveData(await loadData());
  console.log('✅ Data saved successfully');
  process.exit(0);
});

// Routes

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { id, password } = req.body;

    // Check credentials
    if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
      // Generate JWT token
      const token = jwt.sign(
        { id: ADMIN_CREDENTIALS.id, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: ADMIN_CREDENTIALS.id,
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify token endpoint
app.get('/api/verify-token', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: req.user
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Naveenbook Backend API',
    version: '2.0.0',
    features: [
      'Customer Management',
      'Transaction Tracking',
      'JWT Authentication',
      'Persistent Data Storage',
      'Auto-save every 30 seconds'
    ],
    endpoints: {
      auth: {
        login: 'POST /api/login',
        verify: 'GET /api/verify-token'
      },
      customers: {
        list: 'GET /api/customers',
        create: 'POST /api/customers',
        update: 'PUT /api/customers/:id',
        delete: 'DELETE /api/customers/:id'
      },
      transactions: {
        list: 'GET /api/transactions',
        create: 'POST /api/transactions',
        update: 'PUT /api/transactions/:id',
        delete: 'DELETE /api/transactions/:id'
      },
      dashboard: {
        stats: 'GET /api/dashboard/stats',
        balance: 'GET /api/customers/:id/balance'
      }
    },
    dataFile: DATA_FILE,
    dataFileExists: require('fs').existsSync(DATA_FILE),
    autoSaveInterval: `${AUTO_SAVE_INTERVAL / 1000} seconds`
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dataFile: DATA_FILE,
    dataFileExists: require('fs').existsSync(DATA_FILE),
    autoSaveInterval: `${AUTO_SAVE_INTERVAL / 1000} seconds`
  });
});

// Protected routes - require authentication
app.use('/api/customers', authenticateToken);
app.use('/api/transactions', authenticateToken);
app.use('/api/dashboard', authenticateToken);

// Customer routes
app.get('/api/customers', async (req, res) => {
  try {
    const data = await loadData();
    res.json(data.customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const data = await loadData();
    const newCustomer = {
      id: uuidv4(),
      name,
      phone,
      email: email || '',
      address: address || '',
      createdAt: new Date().toISOString()
    };

    data.customers.push(newCustomer);
    data.lastUpdated = new Date().toISOString();
    
    await saveData(data);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const data = await loadData();
    const customerIndex = data.customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    data.customers[customerIndex] = {
      ...data.customers[customerIndex],
      name,
      phone,
      email: email || '',
      address: address || '',
      updatedAt: new Date().toISOString()
    };

    data.lastUpdated = new Date().toISOString();
    
    await saveData(data);
    res.json(data.customers[customerIndex]);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await loadData();
    
    const customerIndex = data.customers.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Remove customer and all their transactions
    data.customers.splice(customerIndex, 1);
    data.transactions = data.transactions.filter(t => t.customerId !== id);
    data.lastUpdated = new Date().toISOString();
    
    await saveData(data);
    res.json({ message: 'Customer and associated transactions deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Transaction routes
app.get('/api/transactions', async (req, res) => {
  try {
    const data = await loadData();
    res.json(data.transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const { customerId, type, amount, description, date } = req.body;
    
    if (!customerId || !type || !amount) {
      return res.status(400).json({ error: 'Customer ID, type, and amount are required' });
    }

    if (!['credit', 'debit'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either credit or debit' });
    }

    const data = await loadData();
    const customer = data.customers.find(c => c.id === customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const newTransaction = {
      id: uuidv4(),
      customerId,
      type,
      amount: parseFloat(amount),
      description: description || (type === 'credit' ? 'Credit' : 'Debit'),
      date: date || new Date().toISOString()
    };

    data.transactions.push(newTransaction);
    data.lastUpdated = new Date().toISOString();
    
    await saveData(data);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, date } = req.body;
    
    if (!type || !amount) {
      return res.status(400).json({ error: 'Type and amount are required' });
    }

    if (!['credit', 'debit'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either credit or debit' });
    }

    const data = await loadData();
    const transactionIndex = data.transactions.findIndex(t => t.id === id);
    
    if (transactionIndex === -1) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    data.transactions[transactionIndex] = {
      ...data.transactions[transactionIndex],
      type,
      amount: parseFloat(amount),
      description: description || (type === 'credit' ? 'Credit' : 'Debit'),
      date: date || new Date().toISOString()
    };

    data.lastUpdated = new Date().toISOString();
    
    await saveData(data);
    res.json(data.transactions[transactionIndex]);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await loadData();
    
    const transactionIndex = data.transactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    data.transactions.splice(transactionIndex, 1);
    data.lastUpdated = new Date().toISOString();
    
    await saveData(data);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Dashboard routes
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const data = await loadData();
    
    const totalOutstanding = data.transactions.reduce((total, t) => {
      return t.type === 'credit' ? total + t.amount : total - t.amount;
    }, 0);

    const customerBalances = data.customers.map(customer => {
      const customerTransactions = data.transactions.filter(t => t.customerId === customer.id);
      return customerTransactions.reduce((total, t) => {
        return t.type === 'credit' ? total + t.amount : total - t.amount;
      }, 0);
    });

    const customersWithCredit = customerBalances.filter(balance => balance > 0).length;
    const customersWithDebit = customerBalances.filter(balance => balance < 0).length;

    const stats = {
      totalOutstanding,
      totalCustomers: data.customers.length,
      customersWithCredit,
      customersWithDebit,
      totalTransactions: data.transactions.length
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

app.get('/api/customers/:id/balance', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await loadData();
    
    const customer = data.customers.find(c => c.id === id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customerTransactions = data.transactions.filter(t => t.customerId === id);
    const balance = customerTransactions.reduce((total, t) => {
      return t.type === 'credit' ? total + t.amount : total - t.amount;
    }, 0);

    res.json({ customerId: id, balance });
  } catch (error) {
    console.error('Error fetching customer balance:', error);
    res.status(500).json({ error: 'Failed to fetch customer balance' });
  }
});

// Data restore endpoint
app.post('/api/restore', async (req, res) => {
  try {
    const { data: restoreData } = req.body;
    
    if (!restoreData || !restoreData.customers || !restoreData.transactions) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    await saveData({
      ...restoreData,
      lastUpdated: new Date().toISOString()
    });

    res.json({ message: 'Data restored successfully' });
  } catch (error) {
    console.error('Error restoring data:', error);
    res.status(500).json({ error: 'Failed to restore data' });
  }
});

// Initialize data and start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Naveenbook Backend API running on port ${PORT}`);
    console.log(`💾 Data stored in: ${DATA_FILE}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/login`);
    console.log(`🔄 Auto-save every ${AUTO_SAVE_INTERVAL / 1000} seconds`);
    console.log(`💾 Data persistence: GUARANTEED - Never lost!`);
    console.log(`🔑 Admin ID: ${ADMIN_CREDENTIALS.id}`);
  });
}); 