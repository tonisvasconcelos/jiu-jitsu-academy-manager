#!/bin/bash

# User Story 1 Testing Script
# This script sets up and tests the new academy creation

echo "🎯 User Story 1: New Academy License Creation Test"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "server/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting User Story 1 testing..."

# Step 1: Check if services are running
print_status "Checking if services are running..."

# Check if database is running
if ! docker-compose ps | grep -q "db.*Up"; then
    print_warning "Database is not running. Starting services..."
    docker-compose up -d db
    sleep 10
fi

# Check if API server is running
if ! curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    print_warning "API server is not running. Please start it with: cd server && npm run dev"
    print_status "Waiting for API server to start..."
    sleep 5
fi

# Step 2: Run database migrations
print_status "Running database migrations..."
cd server
npm run db:migrate
if [ $? -eq 0 ]; then
    print_success "Database migrations completed"
else
    print_error "Database migrations failed"
    exit 1
fi

# Step 3: Create the new academy
print_status "Creating Elite Combat Academy..."
npm run create-academy
if [ $? -eq 0 ]; then
    print_success "Elite Combat Academy created successfully!"
else
    print_error "Academy creation failed"
    exit 1
fi

# Step 4: Test authentication
print_status "Testing authentication..."

# Test system manager login
print_status "Testing system manager login..."
SYSTEM_MANAGER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "elite-combat.jiu-jitsu.com",
    "email": "admin@elite-combat.com",
    "password": "EliteAdmin2024!"
  }')

if echo "$SYSTEM_MANAGER_RESPONSE" | grep -q "success.*true"; then
    print_success "System manager login successful"
    SYSTEM_MANAGER_TOKEN=$(echo "$SYSTEM_MANAGER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    print_error "System manager login failed"
    echo "Response: $SYSTEM_MANAGER_RESPONSE"
fi

# Test branch manager login
print_status "Testing branch manager login..."
BRANCH_MANAGER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "elite-combat.jiu-jitsu.com",
    "email": "manager@elite-combat.com",
    "password": "EliteManager2024!"
  }')

if echo "$BRANCH_MANAGER_RESPONSE" | grep -q "success.*true"; then
    print_success "Branch manager login successful"
else
    print_error "Branch manager login failed"
    echo "Response: $BRANCH_MANAGER_RESPONSE"
fi

# Test student login
print_status "Testing student login..."
STUDENT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "elite-combat.jiu-jitsu.com",
    "email": "emma.w@email.com",
    "password": "EliteStudent2024!"
  }')

if echo "$STUDENT_RESPONSE" | grep -q "success.*true"; then
    print_success "Student login successful"
else
    print_error "Student login failed"
    echo "Response: $STUDENT_RESPONSE"
fi

# Step 5: Test API endpoints
if [ ! -z "$SYSTEM_MANAGER_TOKEN" ]; then
    print_status "Testing API endpoints..."
    
    # Test users endpoint
    USERS_RESPONSE=$(curl -s -X GET http://localhost:3001/api/users \
      -H "Authorization: Bearer $SYSTEM_MANAGER_TOKEN")
    
    if echo "$USERS_RESPONSE" | grep -q "users"; then
        print_success "Users API endpoint working"
    else
        print_error "Users API endpoint failed"
        echo "Response: $USERS_RESPONSE"
    fi
    
    # Test students endpoint
    STUDENTS_RESPONSE=$(curl -s -X GET http://localhost:3001/api/students \
      -H "Authorization: Bearer $SYSTEM_MANAGER_TOKEN")
    
    if echo "$STUDENTS_RESPONSE" | grep -q "students"; then
        print_success "Students API endpoint working"
    else
        print_error "Students API endpoint failed"
        echo "Response: $STUDENTS_RESPONSE"
    fi
    
    # Test classes endpoint
    CLASSES_RESPONSE=$(curl -s -X GET http://localhost:3001/api/classes \
      -H "Authorization: Bearer $SYSTEM_MANAGER_TOKEN")
    
    if echo "$CLASSES_RESPONSE" | grep -q "classes"; then
        print_success "Classes API endpoint working"
    else
        print_error "Classes API endpoint failed"
        echo "Response: $CLASSES_RESPONSE"
    fi
fi

# Step 6: Test public endpoints
print_status "Testing public endpoints..."

# Test public classes endpoint
PUBLIC_CLASSES_RESPONSE=$(curl -s -X GET "http://localhost:3001/api/public/classes?tenantDomain=elite-combat.jiu-jitsu.com")

if echo "$PUBLIC_CLASSES_RESPONSE" | grep -q "classes"; then
    print_success "Public classes endpoint working"
else
    print_error "Public classes endpoint failed"
    echo "Response: $PUBLIC_CLASSES_RESPONSE"
fi

# Step 7: Summary
echo ""
echo "🎉 User Story 1 Testing Summary"
echo "==============================="
echo ""
echo "✅ Elite Combat Academy created with:"
echo "   🏢 Professional license (1 year)"
echo "   👥 25 users (1 system manager, 1 branch manager, 3 coaches, 20 students)"
echo "   📅 5 sample classes"
echo "   🏢 1 branch (Main Dojo)"
echo ""
echo "🔐 Test Credentials:"
echo "   System Manager: admin@elite-combat.com / EliteAdmin2024!"
echo "   Branch Manager: manager@elite-combat.com / EliteManager2024!"
echo "   Coach: marcus@elite-combat.com / EliteCoach2024!"
echo "   Student: emma.w@email.com / EliteStudent2024!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000/login"
echo "   Public Portal: http://localhost:3001/public?tenantDomain=elite-combat.jiu-jitsu.com"
echo "   API: http://localhost:3001/api"
echo ""
echo "📋 Next Steps:"
echo "   1. Test frontend login with the credentials above"
echo "   2. Verify data isolation between tenants"
echo "   3. Test all CRUD operations"
echo "   4. Test public booking system"
echo ""
print_success "User Story 1 testing completed! 🚀"

cd ..
