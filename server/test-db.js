#!/usr/bin/env node

const { testConnection } = require('./dist/config/database');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    await testConnection();
    console.log('✅ Database connection successful!');
    console.log('🎉 Your PostgreSQL database is ready to use.');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n📋 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your .env file configuration');
    console.log('3. Verify database credentials');
    console.log('4. Ensure the database exists');
    console.log('\n💡 For cloud databases, check your connection string and firewall settings.');
  }
}

testDatabaseConnection();
