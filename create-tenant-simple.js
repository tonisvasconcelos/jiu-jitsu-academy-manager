// Simple script to create a tenant and admin user
// Run with: node create-tenant-simple.js

const https = require('https');

// Configuration
const config = {
    // Academy details
    academyName: 'Gracie Barra Copacabana',
    domain: 'gb-copacabana',
    contactEmail: 'admin@gb-copacabana.com',
    contactPhone: '+55 21 99999-9999',
    address: 'Copacabana, Rio de Janeiro, Brazil',
    plan: 'enterprise',
    
    // Admin user details
    adminEmail: 'admin@gb-copacabana.com',
    adminPassword: 'Admin2024!',
    firstName: 'João',
    lastName: 'Silva'
};

// API base URL
const API_BASE = 'https://oss365.app/api';

// Helper function to make HTTP requests
function makeRequest(url, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'oss365.app',
            port: 443,
            path: url,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data ? Buffer.byteLength(data) : 0
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(responseData);
                    resolve({
                        status: res.statusCode,
                        data: jsonData
                    });
                } catch (error) {
                    resolve({
                        status: res.statusCode,
                        data: { error: 'Invalid JSON response', raw: responseData }
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(data);
        }
        
        req.end();
    });
}

// Create tenant
async function createTenant() {
    console.log('🏢 Creating tenant...');
    
    const tenantData = {
        name: config.academyName,
        domain: config.domain,
        plan: config.plan,
        contactEmail: config.contactEmail,
        contactPhone: config.contactPhone,
        address: config.address,
        licenseLimits: {
            students: 1000,
            coaches: 20,
            branches: 1,
            classes: 50
        }
    };

    try {
        const response = await makeRequest('/api/admin/tenants', 'POST', JSON.stringify(tenantData));
        
        console.log(`📊 Tenant Creation Status: ${response.status}`);
        console.log(`✅ Success: ${response.data.success}`);
        
        if (response.data.success) {
            console.log(`🎉 Tenant created successfully!`);
            console.log(`   Name: ${config.academyName}`);
            console.log(`   Domain: ${config.domain}`);
            return true;
        } else {
            console.log(`❌ Tenant creation failed: ${response.data.error || response.data.message}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error creating tenant: ${error.message}`);
        return false;
    }
}

// Create admin user
async function createAdminUser() {
    console.log('👤 Creating admin user...');
    
    const userData = {
        tenantDomain: config.domain,
        email: config.adminEmail,
        password: config.adminPassword,
        firstName: config.firstName,
        lastName: config.lastName,
        role: 'system_manager'
    };

    try {
        const response = await makeRequest('/api/admin/users', 'POST', JSON.stringify(userData));
        
        console.log(`📊 User Creation Status: ${response.status}`);
        console.log(`✅ Success: ${response.data.success}`);
        
        if (response.data.success) {
            console.log(`🎉 Admin user created successfully!`);
            console.log(`   Email: ${config.adminEmail}`);
            console.log(`   Password: ${config.adminPassword}`);
            return true;
        } else {
            console.log(`❌ User creation failed: ${response.data.error || response.data.message}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error creating user: ${error.message}`);
        return false;
    }
}

// Test login
async function testLogin() {
    console.log('🧪 Testing login...');
    
    const loginData = {
        tenantDomain: config.domain,
        email: config.adminEmail,
        password: config.adminPassword
    };

    try {
        const response = await makeRequest('/api/auth/login', 'POST', JSON.stringify(loginData));
        
        console.log(`📊 Login Test Status: ${response.status}`);
        console.log(`✅ Success: ${response.data.success}`);
        
        if (response.data.success) {
            console.log(`🎉 Login successful!`);
            console.log(`   Token: ${response.data.token ? 'Generated' : 'Not provided'}`);
            return true;
        } else {
            console.log(`❌ Login failed: ${response.data.error || response.data.message}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error testing login: ${error.message}`);
        return false;
    }
}

// Main function
async function main() {
    console.log('🚀 Starting tenant and user creation process...\n');
    
    // Step 1: Create tenant
    const tenantCreated = await createTenant();
    if (!tenantCreated) {
        console.log('\n❌ Failed to create tenant. Stopping process.');
        return;
    }
    
    console.log('');
    
    // Step 2: Create admin user
    const userCreated = await createAdminUser();
    if (!userCreated) {
        console.log('\n❌ Failed to create admin user. Stopping process.');
        return;
    }
    
    console.log('');
    
    // Step 3: Test login
    const loginSuccess = await testLogin();
    
    console.log('\n' + '='.repeat(50));
    if (tenantCreated && userCreated && loginSuccess) {
        console.log('🎉 SUCCESS! Your academy is ready to use!');
        console.log('\n📋 Login Credentials:');
        console.log(`   🌐 Domain: ${config.domain}`);
        console.log(`   📧 Email: ${config.adminEmail}`);
        console.log(`   🔑 Password: ${config.adminPassword}`);
        console.log(`   🔗 Login URL: https://oss365.app/login`);
    } else {
        console.log('❌ Some steps failed. Check the logs above.');
    }
    console.log('='.repeat(50));
}

// Run the script
main().catch(console.error);
