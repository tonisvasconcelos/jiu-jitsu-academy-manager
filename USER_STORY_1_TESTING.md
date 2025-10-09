# User Story 1 Testing Guide: New Academy License Creation

## 🎯 User Story
**As a** new fight academy owner  
**I want to** purchase a license for the Oss365 app  
**So that** I can create and manage my own data with 20 students

## 🧪 Testing Steps

### Step 1: Create New Academy License

#### 1.1 Run the Academy Creation Script
```bash
cd server
npm run create-academy
```

**Expected Output:**
```
🏢 Creating new fight academy...
✅ Created tenant: Elite Combat Academy
   Domain: elite-combat.jiu-jitsu.com
   License: professional (expires: 12/31/2024)
✅ Created branch: Main Dojo
✅ Created system manager: admin@elite-combat.com
✅ Created branch manager: manager@elite-combat.com
✅ Created coach: Marcus Rodriguez (Brazilian Jiu-Jitsu)
✅ Created coach: Jessica Chen (Muay Thai)
✅ Created coach: David Thompson (Boxing)
👥 Creating 20 students...
   ✅ EC001: Emma Williams (blue)
   ✅ EC002: James Brown (white)
   ✅ EC003: Sophia Davis (kids-yellow)
   ... (continues for all 20 students)
📅 Creating sample classes...
   ✅ Beginner BJJ - Brazilian Jiu-Jitsu ($30)
   ✅ Advanced BJJ - Brazilian Jiu-Jitsu ($35)
   ✅ Kids BJJ - Brazilian Jiu-Jitsu ($25)
   ✅ Muay Thai Fundamentals - Muay Thai ($32)
   ✅ Boxing Basics - Boxing ($28)
🎉 Elite Combat Academy setup completed successfully!
```

#### 1.2 Verify Database Records
```sql
-- Check tenant creation
SELECT * FROM tenants WHERE domain = 'elite-combat.jiu-jitsu.com';

-- Check user creation (should show 25 users: 1 system manager, 1 branch manager, 3 coaches, 20 students)
SELECT role, COUNT(*) as count FROM users WHERE tenant_id = (
  SELECT id FROM tenants WHERE domain = 'elite-combat.jiu-jitsu.com'
) GROUP BY role;

-- Check student creation
SELECT COUNT(*) as student_count FROM students WHERE tenant_id = (
  SELECT id FROM tenants WHERE domain = 'elite-combat.jiu-jitsu.com'
);

-- Check classes creation
SELECT COUNT(*) as class_count FROM classes WHERE tenant_id = (
  SELECT id FROM tenants WHERE domain = 'elite-combat.jiu-jitsu.com'
);
```

### Step 2: Test Multi-Tenancy Isolation

#### 2.1 Verify Data Isolation
```sql
-- Set session to Elite Combat Academy
SET app.current_tenant_id = (SELECT id FROM tenants WHERE domain = 'elite-combat.jiu-jitsu.com');

-- Should only see Elite Combat Academy data
SELECT COUNT(*) FROM users; -- Should return 25
SELECT COUNT(*) FROM students; -- Should return 20
SELECT COUNT(*) FROM classes; -- Should return 5

-- Switch to OSS365 Academy
SET app.current_tenant_id = (SELECT id FROM tenants WHERE domain = 'oss365');

-- Should only see OSS365 data
SELECT COUNT(*) FROM users; -- Should return different count
SELECT COUNT(*) FROM students; -- Should return different count
SELECT COUNT(*) FROM classes; -- Should return different count
```

### Step 3: Test Authentication & Access

#### 3.1 Test System Manager Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "elite-combat.jiu-jitsu.com",
    "email": "admin@elite-combat.com",
    "password": "EliteAdmin2024!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@elite-combat.com",
    "role": "system_manager",
    "tenantId": "uuid",
    "firstName": "Alex",
    "lastName": "Martinez"
  }
}
```

#### 3.2 Test Branch Manager Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "elite-combat.jiu-jitsu.com",
    "email": "manager@elite-combat.com",
    "password": "EliteManager2024!"
  }'
```

#### 3.3 Test Coach Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "elite-combat.jiu-jitsu.com",
    "email": "marcus@elite-combat.com",
    "password": "EliteCoach2024!"
  }'
```

#### 3.4 Test Student Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "elite-combat.jiu-jitsu.com",
    "email": "emma.w@email.com",
    "password": "EliteStudent2024!"
  }'
```

### Step 4: Test API Endpoints with Authentication

#### 4.1 Test User Management (System Manager)
```bash
# Get all users (should return 25 users)
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_SYSTEM_MANAGER_TOKEN"

# Get specific user
curl -X GET http://localhost:3001/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_SYSTEM_MANAGER_TOKEN"
```

#### 4.2 Test Student Management
```bash
# Get all students (should return 20 students)
curl -X GET http://localhost:3001/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get specific student
curl -X GET http://localhost:3001/api/students/STUDENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4.3 Test Class Management
```bash
# Get all classes (should return 5 classes)
curl -X GET http://localhost:3001/api/classes \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get specific class
curl -X GET http://localhost:3001/api/classes/CLASS_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 5: Test Frontend Integration

#### 5.1 Test Login Page
1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - **Domain:** `elite-combat.jiu-jitsu.com`
   - **Email:** `admin@elite-combat.com`
   - **Password:** `EliteAdmin2024!`
3. Click "Sign In"
4. Should redirect to dashboard

#### 5.2 Test Dashboard Access
1. After login, should see Elite Combat Academy dashboard
2. Verify user info shows correct tenant
3. Check that navigation shows appropriate options for system manager

#### 5.3 Test Student Management
1. Navigate to Students section
2. Should see 20 students listed
3. Verify student data is correct
4. Test creating a new student
5. Test editing existing student

#### 5.4 Test Class Management
1. Navigate to Classes section
2. Should see 5 sample classes
3. Verify class details are correct
4. Test creating a new class
5. Test editing existing class

### Step 6: Test Public Portal

#### 6.1 Test Public Class Calendar
```bash
# Access public portal
curl -X GET "http://localhost:3001/public?tenantDomain=elite-combat.jiu-jitsu.com"
```

#### 6.2 Test Public API Endpoints
```bash
# Get public classes
curl -X GET "http://localhost:3001/api/public/classes?tenantDomain=elite-combat.jiu-jitsu.com"

# Submit booking request
curl -X POST http://localhost:3001/api/public/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "tenantDomain": "elite-combat.jiu-jitsu.com",
    "classId": "CLASS_ID",
    "studentName": "John Doe",
    "studentEmail": "john@example.com",
    "bookingDate": "2024-01-15",
    "notes": "First time student"
  }'
```

## ✅ Acceptance Criteria Verification

### ✅ Multi-Tenancy
- [ ] Elite Combat Academy data is completely isolated from OSS365 Academy
- [ ] RLS policies prevent cross-tenant data access
- [ ] Each tenant has their own domain and authentication

### ✅ User Management
- [ ] System manager can access all features
- [ ] Branch manager can manage their branch
- [ ] Coaches can manage classes and students
- [ ] Students can view their own data

### ✅ Data Creation
- [ ] 1 tenant created with professional license
- [ ] 1 branch created with proper details
- [ ] 25 users created (1 system manager, 1 branch manager, 3 coaches, 20 students)
- [ ] 20 student profiles with complete data
- [ ] 5 sample classes created
- [ ] Subscription record created

### ✅ Authentication & Authorization
- [ ] All user types can log in successfully
- [ ] JWT tokens are generated correctly
- [ ] Role-based access control works
- [ ] Session management works properly

### ✅ API Functionality
- [ ] All CRUD operations work for each entity
- [ ] Validation works correctly
- [ ] Error handling works properly
- [ ] Rate limiting is enforced

### ✅ Frontend Integration
- [ ] Login page works with new tenant
- [ ] Dashboard shows correct data
- [ ] All management pages work
- [ ] Navigation is role-appropriate

### ✅ Public Portal
- [ ] Public class calendar displays correctly
- [ ] Booking system works
- [ ] Public API endpoints are accessible

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check if database is running
docker-compose ps

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

#### 2. Migration Issues
```bash
# Run migrations
npm run db:migrate

# Check migration status
psql -h localhost -U user -d jiu_jitsu_academy_db -c "SELECT * FROM schema_migrations;"
```

#### 3. Authentication Issues
```bash
# Check JWT secret in .env
echo $JWT_SECRET

# Verify token format
# Token should be: header.payload.signature
```

#### 4. RLS Issues
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'users';
```

## 📊 Performance Testing

### Load Testing
```bash
# Test concurrent logins
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"domain":"elite-combat.jiu-jitsu.com","email":"admin@elite-combat.com","password":"EliteAdmin2024!"}' &
done
wait

# Test concurrent API calls
for i in {1..20}; do
  curl -X GET http://localhost:3001/api/students \
    -H "Authorization: Bearer YOUR_TOKEN" &
done
wait
```

### Database Performance
```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE tenant_id = 'tenant-uuid';

-- Check index usage
SELECT * FROM pg_stat_user_indexes WHERE relname = 'users';
```

## 🎉 Success Criteria

The User Story 1 test is successful when:

1. ✅ **New Academy Created**: Elite Combat Academy is fully set up with professional license
2. ✅ **Complete Data Setup**: 20 students, 5 classes, 25 users created successfully
3. ✅ **Multi-Tenancy Works**: Data isolation between tenants is perfect
4. ✅ **Authentication Works**: All user types can log in and access appropriate features
5. ✅ **API Functions**: All CRUD operations work correctly
6. ✅ **Frontend Integration**: React app works seamlessly with new tenant
7. ✅ **Public Portal**: Public booking system works for new academy
8. ✅ **Performance**: System handles load without issues

## 📝 Test Results Template

```
User Story 1 Test Results
========================

Date: ___________
Tester: ___________

✅ Multi-Tenancy: PASS/FAIL
✅ User Management: PASS/FAIL  
✅ Data Creation: PASS/FAIL
✅ Authentication: PASS/FAIL
✅ API Functionality: PASS/FAIL
✅ Frontend Integration: PASS/FAIL
✅ Public Portal: PASS/FAIL
✅ Performance: PASS/FAIL

Overall Result: PASS/FAIL

Notes:
- 
- 
- 

Issues Found:
- 
- 
- 

Recommendations:
- 
- 
- 
```

---

**Ready to test? Run the academy creation script and follow the steps above!** 🚀
