#!/usr/bin/env node

const https = require('https');
const http = require('http');

async function testAPI() {
  console.log('🧪 Testing PostgreSQL API endpoints...');
  
  // Test health endpoint
  try {
    const healthResponse = await makeRequest('GET', 'http://localhost:5000/health');
    console.log('✅ Health endpoint:', healthResponse);
  } catch (error) {
    console.error('❌ Health endpoint failed:', error.message);
  }

  // Test login endpoint
  try {
    const loginData = {
      email: 'admin@demo-jiu-jitsu.com',
      password: 'password123',
      tenantDomain: 'demo.jiu-jitsu.com'
    };
    
    const loginResponse = await makeRequest('POST', 'http://localhost:5000/api/auth/login', loginData);
    console.log('✅ Login endpoint:', loginResponse);
  } catch (error) {
    console.error('❌ Login endpoint failed:', error.message);
    console.error('Full error:', error);
  }
}

function makeRequest(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (e) {
          resolve(responseData);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

testAPI();
