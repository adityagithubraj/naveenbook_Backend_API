const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  try {
    console.log('🧪 Testing My Accounts Lite Backend API...\n');

    // Test 1: Health check
    console.log('1. Testing health check...');
    const health = await axios.get(`${BASE_URL}/`);
    console.log('✅ Health check:', health.data.message);

    // Test 2: Get dashboard
    console.log('\n2. Testing dashboard...');
    const dashboard = await axios.get(`${BASE_URL}/api/dashboard`);
    console.log('✅ Dashboard data:', {
      totalCustomers: dashboard.data.totalCustomers,
      totalTransactions: dashboard.data.totalTransactions,
      netBalance: dashboard.data.netBalance
    });

    // Test 3: Get all customers
    console.log('\n3. Testing get customers...');
    const customers = await axios.get(`${BASE_URL}/api/customers`);
    console.log('✅ Customers found:', customers.data.length);

    // Test 4: Get all transactions
    console.log('\n4. Testing get transactions...');
    const transactions = await axios.get(`${BASE_URL}/api/transactions`);
    console.log('✅ Transactions found:', transactions.data.length);

    // Test 5: Get customer balance
    if (customers.data.length > 0) {
      console.log('\n5. Testing customer balance...');
      const firstCustomer = customers.data[0];
      const balance = await axios.get(`${BASE_URL}/api/customers/${firstCustomer.id}/balance`);
      console.log('✅ Customer balance:', {
        name: balance.data.customerName,
        balance: balance.data.balance,
        totalCredits: balance.data.totalCredits,
        totalDebits: balance.data.totalDebits
      });
    }

    // Test 6: Create new customer
    console.log('\n6. Testing create customer...');
    const newCustomer = await axios.post(`${BASE_URL}/api/customers`, {
      name: 'Test Customer',
      phone: '+1555123456',
      email: 'test@example.com',
      address: '789 Test St, Test City'
    });
    console.log('✅ New customer created:', newCustomer.data.name);

    // Test 7: Create new transaction
    console.log('\n7. Testing create transaction...');
    const newTransaction = await axios.post(`${BASE_URL}/api/transactions`, {
      customerId: newCustomer.data.id,
      type: 'credit',
      amount: 250,
      description: 'Test payment'
    });
    console.log('✅ New transaction created:', {
      type: newTransaction.data.type,
      amount: newTransaction.data.amount,
      description: newTransaction.data.description
    });

    // Test 8: Update customer
    console.log('\n8. Testing update customer...');
    const updatedCustomer = await axios.put(`${BASE_URL}/api/customers/${newCustomer.data.id}`, {
      name: 'Updated Test Customer',
      phone: '+1555123456',
      email: 'updated@example.com',
      address: '789 Updated St, Test City'
    });
    console.log('✅ Customer updated:', updatedCustomer.data.name);

    // Test 9: Filter transactions
    console.log('\n9. Testing transaction filtering...');
    const filteredTransactions = await axios.get(`${BASE_URL}/api/transactions?customerId=${newCustomer.data.id}&type=credit`);
    console.log('✅ Filtered transactions:', filteredTransactions.data.length);

    // Test 10: Get updated dashboard
    console.log('\n10. Testing updated dashboard...');
    const updatedDashboard = await axios.get(`${BASE_URL}/api/dashboard`);
    console.log('✅ Updated dashboard:', {
      totalCustomers: updatedDashboard.data.totalCustomers,
      totalTransactions: updatedDashboard.data.totalTransactions,
      netBalance: updatedDashboard.data.netBalance
    });

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📊 Final Stats:');
    console.log(`   - Customers: ${updatedDashboard.data.totalCustomers}`);
    console.log(`   - Transactions: ${updatedDashboard.data.totalTransactions}`);
    console.log(`   - Net Balance: $${updatedDashboard.data.netBalance}`);

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Run the test
testAPI(); 