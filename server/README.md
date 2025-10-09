# 🥋 Jiu-Jitsu Academy Manager - Backend API

A comprehensive Node.js backend API for the Jiu-Jitsu Academy Manager SaaS platform, built with Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **Multi-tenant Architecture**: Row-level security with tenant isolation
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Role-Based Access Control**: Four user roles with hierarchical permissions
- **RESTful API**: Complete CRUD operations for all entities
- **Public Booking System**: Public endpoints for class booking
- **Database Migrations**: Automated schema management
- **Data Seeding**: Sample data for development and testing
- **Input Validation**: Comprehensive request validation with Joi
- **Error Handling**: Centralized error handling and logging
- **Rate Limiting**: API rate limiting for security
- **CORS Support**: Configurable cross-origin resource sharing

## 🏗️ Architecture

### Database Design
- **Multi-tenancy**: Table-level isolation with `tenant_id` column
- **Row Level Security (RLS)**: PostgreSQL RLS policies for data isolation
- **User Roles**: System Manager > Branch Manager > Coach > Student
- **Comprehensive Schema**: Users, tenants, branches, classes, students, enrollments, check-ins

### API Structure
```
/api
├── /auth          # Authentication endpoints
├── /users         # User management
├── /tenants       # Tenant management (System Manager only)
├── /branches      # Branch management
├── /classes       # Class scheduling
├── /students      # Student management
├── /enrollments   # Class enrollments
├── /check-ins     # Attendance tracking
└── /public        # Public booking system
```

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with pg-promise
- **Authentication**: JWT with bcryptjs
- **Validation**: Joi schemas
- **Security**: Helmet, CORS, Rate limiting
- **Development**: Nodemon, ts-node

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb jiu_jitsu_academy_manager
   
   # Run migrations
   npm run db:migrate
   
   # Seed with sample data
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/jiu_jitsu_academy_manager
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jiu_jitsu_academy_manager
DB_USER=username
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=30d

# Server
PORT=3001
NODE_ENV=development
API_BASE_URL=http://localhost:3001/api

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
```

## 📚 API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "tenantDomain": "demo.jiu-jitsu.com"
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "tenantDomain": "demo.jiu-jitsu.com"
}
```

### Public Endpoints

#### Get Classes
```http
GET /api/public/classes?tenantDomain=demo.jiu-jitsu.com&branchId=optional
```

#### Book Class
```http
POST /api/public/bookings
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "classId": "class-uuid",
  "branchId": "branch-uuid",
  "tenantDomain": "demo.jiu-jitsu.com",
  "notes": "First time student",
  "preferredContactMethod": "email"
}
```

### Protected Endpoints

All protected endpoints require the `Authorization` header:
```http
Authorization: Bearer <jwt-token>
```

#### Get Users
```http
GET /api/users?page=1&limit=10&search=john&role=student
```

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "coach",
  "branchId": "branch-uuid"
}
```

## 🔐 Security Features

### Multi-Tenancy
- **Row Level Security**: All queries automatically filtered by tenant
- **Tenant Context**: Session variable set for each request
- **Data Isolation**: Complete separation between tenants

### Authentication & Authorization
- **JWT Tokens**: Secure access and refresh tokens
- **Role Hierarchy**: System Manager > Branch Manager > Coach > Student
- **Permission Checks**: Middleware validates user permissions
- **Password Security**: bcrypt hashing with configurable rounds

### API Security
- **Rate Limiting**: Configurable request limits
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses

## 🗄️ Database Schema

### Core Tables
- `tenants` - Multi-tenant organization data
- `users` - User accounts with roles and authentication
- `branches` - Physical locations and facilities
- `students` - Student profiles and information
- `classes` - Class schedules and details
- `enrollments` - Student class registrations
- `check_ins` - Attendance tracking
- `bookings` - Public booking requests

### Key Features
- **UUID Primary Keys**: Globally unique identifiers
- **Audit Timestamps**: Created/updated timestamps
- **Soft Deletes**: Optional soft delete support
- **JSON Fields**: Flexible settings and metadata storage
- **Foreign Key Constraints**: Referential integrity

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@host:port/db
   JWT_SECRET=your-production-secret
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Run Migrations**
   ```bash
   npm run db:migrate
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

### Cloud Deployment

The application is designed to be deployed on:
- **Render**: Easy deployment with PostgreSQL addon
- **Railway**: Full-stack deployment platform
- **AWS**: EC2 with RDS PostgreSQL
- **Heroku**: With Heroku Postgres addon

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run db:migrate  # Run database migrations
npm run db:seed     # Seed database with sample data
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
```

### Database Management

```bash
# Create migration
npm run db:migrate

# Seed with sample data
npm run db:seed

# Reset database (development only)
npm run db:reset
```

## 📊 Monitoring & Logging

- **Health Check**: `GET /health`
- **Request Logging**: Morgan middleware
- **Error Logging**: Centralized error handling
- **Performance**: Built-in metrics collection

## 🔄 Integration

### Frontend Integration
The API is designed to work seamlessly with the React frontend:
- **CORS Configuration**: Pre-configured for frontend domains
- **JWT Authentication**: Token-based auth flow
- **Error Handling**: Consistent error response format
- **TypeScript Types**: Shared type definitions

### Third-Party Services
- **Email**: Nodemailer integration for notifications
- **Payments**: Stripe and Mercado Pago hooks
- **File Storage**: Multer for file uploads
- **Maps**: Coordinates storage for branch locations

## 📈 Performance

### Optimization Features
- **Connection Pooling**: PostgreSQL connection management
- **Query Optimization**: Efficient database queries
- **Caching**: Redis integration ready
- **Compression**: Gzip response compression
- **Rate Limiting**: API abuse prevention

## 🛡️ Security Best Practices

1. **Environment Variables**: All secrets in environment
2. **Input Validation**: Comprehensive request validation
3. **SQL Injection Prevention**: Parameterized queries
4. **XSS Protection**: Helmet security headers
5. **CSRF Protection**: Token-based protection
6. **Rate Limiting**: API abuse prevention

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Jiu-Jitsu community** 🥋
