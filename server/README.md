# Jiu-Jitsu Academy Manager - Backend API

A production-ready, multi-tenant SaaS backend for Jiu-Jitsu Academy management with PostgreSQL database.

## 🚀 Quick Start

### 1. Set up PostgreSQL Database

Choose one of these options:

#### Option A: Neon (Recommended - Free)
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string

#### Option B: Supabase (Free)
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Get connection details from Settings > Database

#### Option C: Railway (Free)
1. Go to [https://railway.app](https://railway.app)
2. Sign up and create a PostgreSQL service
3. Copy the connection string

### 2. Configure Environment

Run the setup script:
```bash
npm run setup
```

Or manually create a `.env` file with your database credentials.

### 3. Install Dependencies
```bash
npm install
```

### 4. Build and Setup Database
```bash
# Build the project
npm run build

# Test database connection
npm run db:test

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 5. Start the Server
```bash
npm start
```

The server will be running on `http://localhost:5000`

## 📊 Database Schema

The system includes the following tables with multi-tenant architecture:

- **tenants** - Tenant information and license management
- **users** - User accounts with role-based access control
- **branches** - Academy branch locations
- **students** - Student profiles and information
- **classes** - Class schedules and details
- **enrollments** - Student class enrollments
- **check_ins** - Class attendance tracking
- **student_modalities** - Student training modalities
- **bookings** - Public class bookings
- **subscriptions** - Payment and subscription management

## 🔐 Security Features

- **Row Level Security (RLS)** - Automatic tenant data isolation
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt password encryption
- **Role-Based Access Control** - SYSTEM_MANAGER, BRANCH_MANAGER, COACH, STUDENT
- **CORS Protection** - Configured for production domains
- **Rate Limiting** - API request rate limiting
- **Input Validation** - Joi schema validation

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Admin (System Manager)
- `GET /api/tenants` - List all tenants
- `POST /api/tenants` - Create new tenant
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant
- `GET /api/users` - List all users
- `POST /api/users` - Create new user

### Tenant Management
- `GET /api/branches` - List tenant branches
- `POST /api/branches` - Create new branch
- `GET /api/students` - List tenant students
- `POST /api/students` - Create new student
- `GET /api/classes` - List tenant classes
- `POST /api/classes` - Create new class

### Public
- `GET /api/public/classes` - Public class schedules
- `POST /api/public/bookings` - Public class bookings

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed initial data
- `npm run db:test` - Test database connection
- `npm run setup` - Interactive database setup
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Environment Variables

Required environment variables:
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jiu_jitsu_academy_manager
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# Server
PORT=5000
NODE_ENV=development
API_BASE_URL=http://localhost:5000/api
CORS_ORIGIN=https://oss365.app
```

## 🚀 Deployment

### Production Checklist
1. Set up production PostgreSQL database
2. Update environment variables for production
3. Set secure JWT secrets
4. Configure CORS for production domains
5. Set up SSL certificates
6. Configure rate limiting
7. Set up monitoring and logging

### Docker Deployment
```bash
# Build Docker image
docker build -t jiu-jitsu-api .

# Run with environment variables
docker run -p 5000:5000 --env-file .env jiu-jitsu-api
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support, email support@oss365.app or create an issue in the repository.