const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

class Database {
  constructor() {
    this.customers = [];
    this.transactions = [];
    this.dataPath = path.join(__dirname, '../data/database.json');
    this.isInitialized = false;
  }

  async initialize() {
    try {
      if (config.database.type === 'json-file') {
        await this.loadFromFile();
      } else {
        await this.initializeSampleData();
      }
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      await this.initializeSampleData();
      this.isInitialized = true;
    }
  }

  async loadFromFile() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      const parsed = JSON.parse(data);
      this.customers = parsed.customers || [];
      this.transactions = parsed.transactions || [];
      console.log(`Loaded ${this.customers.length} customers and ${this.transactions.length} transactions from file`);
    } catch (error) {
      console.log('No existing database file found, starting with empty data');
      this.customers = [];
      this.transactions = [];
    }
  }

  async saveToFile() {
    if (config.database.type !== 'json-file') return;

    try {
      const data = {
        customers: this.customers,
        transactions: this.transactions,
        lastUpdated: new Date().toISOString(),
        version: config.version || '1.0.0'
      };

      // Ensure data directory exists
      const dataDir = path.dirname(this.dataPath);
      await fs.mkdir(dataDir, { recursive: true });

      await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
      console.log('Database saved to file successfully');
    } catch (error) {
      console.error('Failed to save database to file:', error);
    }
  }

  async initializeSampleData() {
    if (!config.sampleData.enabled || this.customers.length > 0) return;

    console.log('Initializing sample data...');

    // Create sample customers
    const customer1 = {
      id: uuidv4(),
      name: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      address: '123 Main St, City, State',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const customer2 = {
      id: uuidv4(),
      name: 'Jane Smith',
      phone: '+0987654321',
      email: 'jane@example.com',
      address: '456 Oak Ave, Town, State',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.customers = [customer1, customer2];

    // Create sample transactions
    const transaction1 = {
      id: uuidv4(),
      customerId: customer1.id,
      type: 'credit',
      amount: 1000,
      description: 'Initial payment',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const transaction2 = {
      id: uuidv4(),
      customerId: customer2.id,
      type: 'debit',
      amount: 500,
      description: 'Service charge',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.transactions = [transaction1, transaction2];

    console.log(`Sample data initialized: ${this.customers.length} customers, ${this.transactions.length} transactions`);
  }

  // Customer methods
  getAllCustomers() {
    return [...this.customers];
  }

  getCustomerById(id) {
    return this.customers.find(c => c.id === id);
  }

  async createCustomer(customerData) {
    const customer = {
      id: uuidv4(),
      ...customerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.customers.push(customer);
    await this.saveToFile();
    return customer;
  }

  async updateCustomer(id, customerData) {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.customers[index] = {
      ...this.customers[index],
      ...customerData,
      updatedAt: new Date().toISOString()
    };

    await this.saveToFile();
    return this.customers[index];
  }

  async deleteCustomer(id) {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return false;

    // Remove all transactions for this customer
    this.transactions = this.transactions.filter(t => t.customerId !== id);
    
    // Remove customer
    this.customers.splice(index, 1);
    
    await this.saveToFile();
    return true;
  }

  // Transaction methods
  getAllTransactions(filters = {}) {
    let filtered = [...this.transactions];

    if (filters.customerId) {
      filtered = filtered.filter(t => t.customerId === filters.customerId);
    }

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.endDate));
    }

    return filtered;
  }

  getTransactionById(id) {
    return this.transactions.find(t => t.id === id);
  }

  async createTransaction(transactionData) {
    const transaction = {
      id: uuidv4(),
      ...transactionData,
      date: transactionData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.transactions.push(transaction);
    await this.saveToFile();
    return transaction;
  }

  async updateTransaction(id, transactionData) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.transactions[index] = {
      ...this.transactions[index],
      ...transactionData,
      updatedAt: new Date().toISOString()
    };

    await this.saveToFile();
    return this.transactions[index];
  }

  async deleteTransaction(id) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.transactions.splice(index, 1);
    await this.saveToFile();
    return true;
  }

  // Utility methods
  getCustomerBalance(customerId) {
    const customer = this.getCustomerById(customerId);
    if (!customer) return null;

    const customerTransactions = this.transactions.filter(t => t.customerId === customerId);
    
    const balance = customerTransactions.reduce((total, transaction) => {
      if (transaction.type === 'credit') {
        return total + transaction.amount;
      } else {
        return total - transaction.amount;
      }
    }, 0);

    return {
      customerId,
      customerName: customer.name,
      balance,
      totalCredits: customerTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0),
      totalDebits: customerTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0),
      transactionCount: customerTransactions.length
    };
  }

  getDashboardStats() {
    const totalCustomers = this.customers.length;
    const totalTransactions = this.transactions.length;
    
    const totalCredits = this.transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalDebits = this.transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const netBalance = totalCredits - totalDebits;
    
    const recentTransactions = this.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(t => {
        const customer = this.customers.find(c => c.id === t.customerId);
        return {
          ...t,
          customerName: customer ? customer.name : 'Unknown'
        };
      });

    return {
      totalCustomers,
      totalTransactions,
      totalCredits,
      totalDebits,
      netBalance,
      recentTransactions
    };
  }

  // Backup and restore
  async backup() {
    const backupData = {
      customers: this.customers,
      transactions: this.transactions,
      backupDate: new Date().toISOString(),
      version: config.version || '1.0.0'
    };

    const backupPath = path.join(__dirname, '../data/backup', `backup-${Date.now()}.json`);
    
    try {
      const backupDir = path.dirname(backupPath);
      await fs.mkdir(backupDir, { recursive: true });
      await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
      console.log(`Backup created: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('Failed to create backup:', error);
      throw error;
    }
  }
}

module.exports = new Database(); 