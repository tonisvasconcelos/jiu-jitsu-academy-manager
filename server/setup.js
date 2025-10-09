#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 PostgreSQL Database Setup for Jiu-Jitsu Academy Manager');
console.log('========================================================\n');

const questions = [
  {
    key: 'DB_HOST',
    question: 'Database Host (e.g., localhost or your-cloud-host): ',
    default: 'localhost'
  },
  {
    key: 'DB_PORT',
    question: 'Database Port: ',
    default: '5432'
  },
  {
    key: 'DB_NAME',
    question: 'Database Name: ',
    default: 'jiu_jitsu_academy_manager'
  },
  {
    key: 'DB_USER',
    question: 'Database Username: ',
    default: 'postgres'
  },
  {
    key: 'DB_PASSWORD',
    question: 'Database Password: ',
    default: 'password'
  },
  {
    key: 'JWT_SECRET',
    question: 'JWT Secret (generate a random string): ',
    default: 'your-super-secret-jwt-key-here-change-in-production'
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    generateEnvFile();
    return;
  }

  const question = questions[index];
  rl.question(question.question, (answer) => {
    answers[question.key] = answer.trim() || question.default;
    askQuestion(index + 1);
  });
}

function generateEnvFile() {
  const envContent = `# Database Configuration
DATABASE_URL=postgresql://${answers.DB_USER}:${answers.DB_PASSWORD}@${answers.DB_HOST}:${answers.DB_PORT}/${answers.DB_NAME}
DB_HOST=${answers.DB_HOST}
DB_PORT=${answers.DB_PORT}
DB_NAME=${answers.DB_NAME}
DB_USER=${answers.DB_USER}
DB_PASSWORD=${answers.DB_PASSWORD}

# JWT Configuration
JWT_SECRET=${answers.JWT_SECRET}
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=${answers.JWT_SECRET}-refresh
JWT_REFRESH_EXPIRES_IN=30d

# Server Configuration
PORT=5000
NODE_ENV=development
API_BASE_URL=http://localhost:5000/api

# CORS Configuration
CORS_ORIGIN=https://oss365.app,http://localhost:3000,http://localhost:5173

# Email Configuration (for notifications and invitations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@jiu-jitsu-academy.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Stripe Configuration (for subscription management)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Mercado Pago Configuration (alternative payment provider)
MERCADO_PAGO_ACCESS_TOKEN=your_mercado_pago_access_token
MERCADO_PAGO_PUBLIC_KEY=your_mercado_pago_public_key

# License Configuration
DEFAULT_TRIAL_DAYS=14
DEFAULT_LICENSE_DAYS=365

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-key
`;

  const envPath = path.join(__dirname, '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure your PostgreSQL database is running');
    console.log('2. Run: npm run build');
    console.log('3. Run: npm run db:migrate');
    console.log('4. Run: npm run db:seed');
    console.log('5. Run: npm start');
    console.log('\n🎉 Your database will be ready!');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }

  rl.close();
}

// Start the setup process
askQuestion(0);
