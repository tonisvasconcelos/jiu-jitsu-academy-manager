import React, { useState } from 'react';

interface LicenseConfig {
  users: number;
  coaches: number;
  branches: number;
  students: number;
  classes: number;
}

const licenseConfigs: Record<string, LicenseConfig> = {
  trial: { users: 5, coaches: 1, branches: 1, students: 25, classes: 5 },
  basic: { users: 10, coaches: 2, branches: 1, students: 50, classes: 10 },
  professional: { users: 25, coaches: 5, branches: 2, students: 100, classes: 20 },
  enterprise: { users: 50, coaches: 10, branches: 5, students: 500, classes: 50 },
  custom: { users: 0, coaches: 0, branches: 0, students: 0, classes: 0 }
};

const TenantCreator: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: 'Gracie Barra Copacabana Ltda',
    companyId: '12.345.678/0001-90',
    domain: 'gb-copacabana',
    contactEmail: 'admin@gb-copacabana.com',
    contactPhone: '+55 21 99999-9999',
    address: 'Rua Copacabana, 123, Rio de Janeiro, RJ, Brazil',
    licenseType: 'enterprise',
    maxUsers: 50,
    maxCoaches: 10,
    maxBranches: 5,
    maxStudents: 500,
    maxClasses: 50,
    adminEmail: 'admin@gb-copacabana.com',
    adminPassword: 'Admin2024!',
    firstName: 'João',
    lastName: 'Silva',
    userRole: 'system_manager'
  });

  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const updateLicenseLimits = (licenseType: string) => {
    const config = licenseConfigs[licenseType];
    if (config) {
      setFormData(prev => ({
        ...prev,
        licenseType,
        maxUsers: config.users,
        maxCoaches: config.coaches,
        maxBranches: config.branches,
        maxStudents: config.students,
        maxClasses: config.classes
      }));
    }
  };

  const validateCustomLimits = (): boolean => {
    const { licenseType, maxUsers, maxCoaches, maxBranches, maxStudents } = formData;
    
    if (licenseType === 'custom') {
      return true;
    }
    
    if (maxUsers < 1 || maxCoaches < 1 || maxBranches < 1 || maxStudents < 1) {
      alert('All limits must be at least 1');
      return false;
    }
    
    return true;
  };

  const createTenantAndUser = async () => {
    setIsLoading(true);
    setResult('Creating tenant and admin user...');

    const { companyName, companyId, domain, contactEmail, contactPhone, address, 
            licenseType, maxUsers, maxCoaches, maxBranches, maxStudents, maxClasses,
            adminEmail, adminPassword, firstName, lastName, userRole } = formData;

    // Validate required fields
    if (!companyName || !companyId || !domain || !contactEmail || !adminEmail || !adminPassword || !firstName || !lastName) {
      setResult('❌ Please fill in all required fields (marked with *)');
      setIsLoading(false);
      return;
    }

    // Validate license limits
    if (!validateCustomLimits()) {
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Create tenant
      const tenantResponse = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName,
          domain: domain,
          plan: licenseType,
          contactEmail: contactEmail,
          contactPhone: contactPhone,
          address: address,
          companyId: companyId,
          licenseLimits: {
            users: maxUsers,
            coaches: maxCoaches,
            branches: maxBranches,
            students: maxStudents,
            classes: maxClasses
          }
        })
      });
      
      const tenantData = await tenantResponse.json();
      
      let resultHtml = `
        <div style="padding: 15px; margin: 15px 0; border-radius: 8px; background: ${tenantData.success ? '#d4edda' : '#f8d7da'}; border: 1px solid ${tenantData.success ? '#c3e6cb' : '#f5c6cb'};">
          <h3>🏢 Tenant Creation Result</h3>
          <p><strong>Status:</strong> ${tenantResponse.status}</p>
          <p><strong>Success:</strong> ${tenantData.success}</p>
          <p><strong>Message:</strong> ${tenantData.message || tenantData.error || 'No message'}</p>
        </div>
      `;
      
      if (tenantData.success) {
        // Step 2: Create admin user
        const userResponse = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantDomain: domain,
            email: adminEmail,
            password: adminPassword,
            firstName: firstName,
            lastName: lastName,
            role: userRole
          })
        });
        
        const userData = await userResponse.json();
        
        resultHtml += `
          <div style="padding: 15px; margin: 15px 0; border-radius: 8px; background: ${userData.success ? '#d4edda' : '#f8d7da'}; border: 1px solid ${userData.success ? '#c3e6cb' : '#f5c6cb'};">
            <h3>👤 Admin User Creation Result</h3>
            <p><strong>Status:</strong> ${userResponse.status}</p>
            <p><strong>Success:</strong> ${userData.success}</p>
            <p><strong>Message:</strong> ${userData.message || userData.error || 'No message'}</p>
          </div>
        `;
        
        if (userData.success) {
          resultHtml += `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 15px 0;">
              <h3>🎉 Success! Customer License Created</h3>
              
              <h4>🏢 Company Information:</h4>
              <p><strong>Company Name:</strong> ${companyName}</p>
              <p><strong>Company ID:</strong> ${companyId}</p>
              <p><strong>Domain:</strong> ${domain}</p>
              <p><strong>Contact Email:</strong> ${contactEmail}</p>
              <p><strong>Contact Phone:</strong> ${contactPhone}</p>
              <p><strong>Address:</strong> ${address}</p>
              
              <h4>📋 License Information:</h4>
              <p><strong>License Type:</strong> ${licenseType.toUpperCase()}</p>
              <p><strong>Max Users:</strong> ${maxUsers}</p>
              <p><strong>Max Coaches:</strong> ${maxCoaches}</p>
              <p><strong>Max Branches:</strong> ${maxBranches}</p>
              <p><strong>Max Students:</strong> ${maxStudents}</p>
              <p><strong>Max Classes:</strong> ${maxClasses}</p>
              
              <h4>👤 Admin User Access:</h4>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${adminEmail}</p>
              <p><strong>Password:</strong> ${adminPassword}</p>
              <p><strong>Role:</strong> ${userRole.replace('_', ' ').toUpperCase()}</p>
              
              <hr style="margin: 20px 0;">
              <p><strong>🔗 Login URL:</strong> <a href="/login" target="_blank">https://oss365.app/login</a></p>
              <p><strong>📧 Send these credentials to your customer</strong></p>
            </div>
          `;
        }
      }
      
      setResult(resultHtml);
    } catch (error) {
      setResult(`
        <div style="padding: 15px; margin: 15px 0; border-radius: 8px; background: #f8d7da; border: 1px solid #f5c6cb;">
          <h3>❌ Error</h3>
          <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      `);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    const { domain, adminEmail, adminPassword } = formData;

    if (!domain || !adminEmail || !adminPassword) {
      setResult('❌ Please create a tenant first or fill in the domain, email, and password fields.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantDomain: domain,
          email: adminEmail,
          password: adminPassword
        })
      });
      
      const data = await response.json();
      
      const resultHtml = `
        <div style="padding: 15px; margin: 15px 0; border-radius: 8px; background: ${data.success ? '#d4edda' : '#f8d7da'}; border: 1px solid ${data.success ? '#c3e6cb' : '#f5c6cb'};">
          <h3>🧪 Login Test Result</h3>
          <p><strong>Status:</strong> ${response.status}</p>
          <p><strong>Success:</strong> ${data.success}</p>
          <p><strong>Message:</strong> ${data.message || data.error || 'No message'}</p>
          ${data.success ? '<p><strong>🎉 Login successful! You can now access your academy.</strong></p>' : ''}
        </div>
      `;
      
      setResult(resultHtml);
    } catch (error) {
      setResult(`
        <div style="padding: 15px; margin: 15px 0; border-radius: 8px; background: #f8d7da; border: 1px solid #f5c6cb;">
          <h3>❌ Login Test Error</h3>
          <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      `);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🏢 Simple Tenant & User Creator</h1>
      
      <div style={{ background: '#d1ecf1', border: '1px solid #bee5eb', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
        <strong>📋 Instructions:</strong>
        <ol>
          <li>Fill out the form below with your academy details</li>
          <li>Click "Create Tenant & Admin User"</li>
          <li>Use the provided credentials to log in</li>
        </ol>
      </div>

      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
        <h2>🏢 Company Information</h2>
        
        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company Name *:</label>
          <input 
            type="text" 
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company ID (CNPJ/Tax ID) *:</label>
          <input 
            type="text" 
            value={formData.companyId}
            onChange={(e) => setFormData(prev => ({ ...prev, companyId: e.target.value }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Domain (unique identifier) *:</label>
          <input 
            type="text" 
            value={formData.domain}
            onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contact Email *:</label>
          <input 
            type="email" 
            value={formData.contactEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contact Phone *:</label>
          <input 
            type="tel" 
            value={formData.contactPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address *:</label>
          <input 
            type="text" 
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
      </div>

      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
        <h2>📋 License Configuration</h2>
        
        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>License Type *:</label>
          <select 
            value={formData.licenseType}
            onChange={(e) => updateLicenseLimits(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="trial">Trial (30 days)</option>
            <option value="basic">Basic (1 year)</option>
            <option value="professional">Professional (1 year)</option>
            <option value="enterprise">Enterprise (1 year)</option>
            <option value="custom">Custom License</option>
          </select>
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Maximum Users *:</label>
          <input 
            type="number" 
            min="1" 
            max="1000" 
            value={formData.maxUsers}
            onChange={(e) => setFormData(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Maximum Coaches *:</label>
          <input 
            type="number" 
            min="1" 
            max="100" 
            value={formData.maxCoaches}
            onChange={(e) => setFormData(prev => ({ ...prev, maxCoaches: parseInt(e.target.value) }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Maximum Branches *:</label>
          <input 
            type="number" 
            min="1" 
            max="10" 
            value={formData.maxBranches}
            onChange={(e) => setFormData(prev => ({ ...prev, maxBranches: parseInt(e.target.value) }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Maximum Students *:</label>
          <input 
            type="number" 
            min="1" 
            max="10000" 
            value={formData.maxStudents}
            onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Maximum Classes:</label>
          <input 
            type="number" 
            min="1" 
            max="500" 
            value={formData.maxClasses}
            onChange={(e) => setFormData(prev => ({ ...prev, maxClasses: parseInt(e.target.value) }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
      </div>

      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
        <h2>👤 Admin User Information</h2>
        
        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Admin Email *:</label>
          <input 
            type="email" 
            value={formData.adminEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Admin Password *:</label>
          <input 
            type="password" 
            value={formData.adminPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, adminPassword: e.target.value }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>First Name *:</label>
          <input 
            type="text" 
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Last Name *:</label>
          <input 
            type="text" 
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>User Role *:</label>
          <select 
            value={formData.userRole}
            onChange={(e) => setFormData(prev => ({ ...prev, userRole: e.target.value }))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="system_manager">System Manager (Full Access)</option>
            <option value="branch_manager">Branch Manager (Branch Access)</option>
            <option value="coach">Coach (Limited Access)</option>
          </select>
        </div>
      </div>

      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
        <button 
          onClick={createTenantAndUser}
          disabled={isLoading}
          style={{ 
            background: '#007bff', 
            color: 'white', 
            padding: '12px 20px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginRight: '10px'
          }}
        >
          {isLoading ? 'Creating...' : '🚀 Create Tenant & Admin User'}
        </button>
        
        <button 
          onClick={testLogin}
          style={{ 
            background: '#28a745', 
            color: 'white', 
            padding: '12px 20px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🧪 Test Login
        </button>
      </div>

      {result && (
        <div dangerouslySetInnerHTML={{ __html: result }} />
      )}
    </div>
  );
};

export default TenantCreator;
