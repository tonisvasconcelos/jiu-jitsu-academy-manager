# 🚀 Deployment Guide - Jiu-Jitsu Academy Manager

This guide covers deploying the Jiu-Jitsu Academy Manager SaaS platform to various cloud providers.

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 13+ database
- Git repository access
- Cloud provider account (Render, Railway, AWS, etc.)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Node.js API    │    │  PostgreSQL DB  │
│   (GitHub Pages) │◄──►│   (Backend)     │◄──►│   (Managed)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Deployment Options

### Option 1: Render (Recommended for Quick Start)

#### Backend API Deployment

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   ```
   Name: jiu-jitsu-api
   Environment: Node
   Build Command: cd server && npm install && npm run build
   Start Command: cd server && npm start
   ```

3. **Environment Variables**
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@host:port/db
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   PORT=10000
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

4. **Database Setup**
   - Add PostgreSQL service in Render
   - Copy connection string to `DATABASE_URL`
   - Run migrations: `npm run db:migrate`
   - Seed data: `npm run db:seed`

#### Frontend Deployment

1. **GitHub Pages Setup**
   ```bash
   # Update vite.config.ts
   base: '/your-repo-name/'
   
   # Update package.json
   "homepage": "https://username.github.io/your-repo-name"
   
   # Deploy
   npm run deploy
   ```

2. **Update API URL**
   ```env
   VITE_API_BASE_URL=https://your-api-url.onrender.com/api
   ```

### Option 2: Railway

#### Full-Stack Deployment

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select your repository

2. **Configure Services**
   - **Database**: Add PostgreSQL service
   - **Backend**: Configure as Node.js service
   - **Frontend**: Deploy to Railway or GitHub Pages

3. **Environment Variables**
   ```env
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-secret-key
   PORT=${{PORT}}
   ```

### Option 3: AWS (Production Scale)

#### Infrastructure Setup

1. **RDS PostgreSQL**
   ```bash
   # Create RDS instance
   aws rds create-db-instance \
     --db-instance-identifier jiu-jitsu-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password your-password
   ```

2. **EC2 Instance**
   ```bash
   # Launch EC2 instance
   # Install Node.js, PM2, Nginx
   sudo apt update
   sudo apt install nodejs npm nginx
   npm install -g pm2
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone your-repo
   cd your-repo/server
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start dist/index.js --name jiu-jitsu-api
   pm2 save
   pm2 startup
   ```

4. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location / {
           root /var/www/html;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## 🔧 Environment Configuration

### Backend Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jiu_jitsu_academy_manager
DB_USER=username
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=30d

# Server Configuration
PORT=3001
NODE_ENV=production
API_BASE_URL=https://your-api-domain.com/api

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@your-domain.com

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Payment Integration (Optional)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
MERCADO_PAGO_ACCESS_TOKEN=your_mercado_pago_access_token
```

### Frontend Environment Variables

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=Jiu-Jitsu Academy Manager
VITE_APP_VERSION=1.0.0
```

## 🗄️ Database Setup

### 1. Create Database
```sql
CREATE DATABASE jiu_jitsu_academy_manager;
CREATE USER academy_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE jiu_jitsu_academy_manager TO academy_user;
```

### 2. Run Migrations
```bash
cd server
npm run db:migrate
```

### 3. Seed Sample Data
```bash
npm run db:seed
```

### 4. Verify Setup
```bash
# Check tables
psql -d jiu_jitsu_academy_manager -c "\dt"

# Check sample data
psql -d jiu_jitsu_academy_manager -c "SELECT * FROM tenants;"
```

## 🔐 Security Configuration

### 1. SSL/TLS Setup
```bash
# Using Let's Encrypt (Certbot)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 2. Environment Security
- Use strong, unique passwords
- Rotate JWT secrets regularly
- Enable database SSL connections
- Configure firewall rules
- Use environment-specific configurations

### 3. Database Security
```sql
-- Enable SSL
ALTER SYSTEM SET ssl = on;

-- Create read-only user for reporting
CREATE USER readonly_user WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE jiu_jitsu_academy_manager TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
```

## 📊 Monitoring & Logging

### 1. Application Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-logrotate
pm2 monit
```

### 2. Database Monitoring
```sql
-- Monitor active connections
SELECT count(*) FROM pg_stat_activity;

-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### 3. Log Management
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/jiu-jitsu-api

# Log rotation configuration
/var/log/jiu-jitsu-api/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 nodejs nodejs
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd server && npm ci
      
      - name: Run tests
        run: cd server && npm test
      
      - name: Build application
        run: cd server && npm run build
      
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build frontend
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🧪 Testing Deployment

### 1. Health Checks
```bash
# API Health Check
curl https://your-api-domain.com/health

# Database Connection
curl https://your-api-domain.com/api/auth/me \
  -H "Authorization: Bearer your-token"
```

### 2. Load Testing
```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 https://your-api-domain.com/health
```

### 3. Security Testing
```bash
# SSL Test
curl -I https://your-domain.com

# Security Headers
curl -I https://your-api-domain.com/api/health
```

## 📈 Scaling Considerations

### 1. Horizontal Scaling
- Use load balancers (AWS ALB, Nginx)
- Implement database read replicas
- Use Redis for session storage
- Consider microservices architecture

### 2. Database Optimization
- Implement connection pooling
- Add database indexes
- Use query optimization
- Consider database sharding

### 3. Caching Strategy
- Implement Redis caching
- Use CDN for static assets
- Cache API responses
- Implement browser caching

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check database status
   pg_isready -h your-db-host -p 5432
   
   # Test connection
   psql -h your-db-host -U username -d database_name
   ```

2. **JWT Token Issues**
   ```bash
   # Verify JWT secret
   echo $JWT_SECRET
   
   # Test token generation
   node -e "console.log(require('jsonwebtoken').sign({test: true}, process.env.JWT_SECRET))"
   ```

3. **CORS Issues**
   ```bash
   # Check CORS configuration
   curl -H "Origin: https://your-frontend.com" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS https://your-api.com/api/auth/login
   ```

## 📞 Support

For deployment support:
- Check the logs: `pm2 logs jiu-jitsu-api`
- Monitor resources: `pm2 monit`
- Database queries: `psql -d jiu_jitsu_academy_manager`
- API testing: Use Postman or curl

---

**Happy Deploying! 🚀**
