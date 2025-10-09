# PostgreSQL Database Setup Guide

## Option 1: Neon (Recommended - Free Tier)

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string
5. Update the environment variables in your `.env` file

## Option 2: Supabase (Free Tier)

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string
6. Update the environment variables in your `.env` file

## Option 3: Railway (Free Tier)

1. Go to [https://railway.app](https://railway.app)
2. Sign up for a free account
3. Create a new PostgreSQL service
4. Copy the connection string
5. Update the environment variables in your `.env` file

## Environment Variables

Once you have your database connection string, update your `.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database
DB_HOST=your-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

# Server Configuration
PORT=5000
NODE_ENV=development
API_BASE_URL=http://localhost:5000/api

# CORS Configuration
CORS_ORIGIN=https://oss365.app,http://localhost:3000,http://localhost:5173
```

## Running Migrations

After setting up your database:

1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Run migrations: `npm run db:migrate`
4. Seed initial data: `npm run db:seed`
5. Start the server: `npm start`

## Testing the Setup

1. Start the server: `npm start`
2. Test health endpoint: `curl http://localhost:5000/health`
3. Test database connection: Check server logs for "Database connection established successfully"
