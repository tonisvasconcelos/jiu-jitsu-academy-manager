# User Story 1 Testing Script (PowerShell)
# This script sets up and tests the new academy creation

Write-Host "🎯 User Story 1: New Academy License Creation Test" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Function to print colored output
function Write-Info {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if we're in the right directory
if (-not (Test-Path "server/package.json")) {
    Write-Error "Please run this script from the project root directory"
    exit 1
}

Write-Info "Starting User Story 1 testing..."

# Step 1: Check if services are running
Write-Info "Checking if services are running..."

# Check if database is running
$dbStatus = docker-compose ps | Select-String "db.*Up"
if (-not $dbStatus) {
    Write-Warning "Database is not running. Starting services..."
    docker-compose up -d db
    Start-Sleep -Seconds 10
}

# Check if API server is running
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method Get -TimeoutSec 5
} catch {
    Write-Warning "API server is not running. Please start it with: cd server && npm run dev"
    Write-Info "Waiting for API server to start..."
    Start-Sleep -Seconds 5
}

# Step 2: Run database migrations
Write-Info "Running database migrations..."
Set-Location server
npm run db:migrate
if ($LASTEXITCODE -eq 0) {
    Write-Success "Database migrations completed"
} else {
    Write-Error "Database migrations failed"
    exit 1
}

# Step 3: Create the new academy
Write-Info "Creating Elite Combat Academy..."
npm run create-academy
if ($LASTEXITCODE -eq 0) {
    Write-Success "Elite Combat Academy created successfully!"
} else {
    Write-Error "Academy creation failed"
    exit 1
}

# Step 4: Test authentication
Write-Info "Testing authentication..."

# Test system manager login
Write-Info "Testing system manager login..."
$systemManagerBody = @{
    domain = "elite-combat.jiu-jitsu.com"
    email = "admin@elite-combat.com"
    password = "EliteAdmin2024!"
} | ConvertTo-Json

try {
    $systemManagerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -Body $systemManagerBody -ContentType "application/json"
    if ($systemManagerResponse.success) {
        Write-Success "System manager login successful"
        $systemManagerToken = $systemManagerResponse.token
    } else {
        Write-Error "System manager login failed"
        Write-Host "Response: $($systemManagerResponse | ConvertTo-Json)"
    }
} catch {
    Write-Error "System manager login failed: $($_.Exception.Message)"
}

# Test branch manager login
Write-Info "Testing branch manager login..."
$branchManagerBody = @{
    domain = "elite-combat.jiu-jitsu.com"
    email = "manager@elite-combat.com"
    password = "EliteManager2024!"
} | ConvertTo-Json

try {
    $branchManagerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -Body $branchManagerBody -ContentType "application/json"
    if ($branchManagerResponse.success) {
        Write-Success "Branch manager login successful"
    } else {
        Write-Error "Branch manager login failed"
        Write-Host "Response: $($branchManagerResponse | ConvertTo-Json)"
    }
} catch {
    Write-Error "Branch manager login failed: $($_.Exception.Message)"
}

# Test student login
Write-Info "Testing student login..."
$studentBody = @{
    domain = "elite-combat.jiu-jitsu.com"
    email = "emma.w@email.com"
    password = "EliteStudent2024!"
} | ConvertTo-Json

try {
    $studentResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -Body $studentBody -ContentType "application/json"
    if ($studentResponse.success) {
        Write-Success "Student login successful"
    } else {
        Write-Error "Student login failed"
        Write-Host "Response: $($studentResponse | ConvertTo-Json)"
    }
} catch {
    Write-Error "Student login failed: $($_.Exception.Message)"
}

# Step 5: Test API endpoints
if ($systemManagerToken) {
    Write-Info "Testing API endpoints..."
    
    $headers = @{
        "Authorization" = "Bearer $systemManagerToken"
    }
    
    # Test users endpoint
    try {
        $usersResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users" -Method Get -Headers $headers
        Write-Success "Users API endpoint working"
    } catch {
        Write-Error "Users API endpoint failed: $($_.Exception.Message)"
    }
    
    # Test students endpoint
    try {
        $studentsResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/students" -Method Get -Headers $headers
        Write-Success "Students API endpoint working"
    } catch {
        Write-Error "Students API endpoint failed: $($_.Exception.Message)"
    }
    
    # Test classes endpoint
    try {
        $classesResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/classes" -Method Get -Headers $headers
        Write-Success "Classes API endpoint working"
    } catch {
        Write-Error "Classes API endpoint failed: $($_.Exception.Message)"
    }
}

# Step 6: Test public endpoints
Write-Info "Testing public endpoints..."

# Test public classes endpoint
try {
    $publicClassesResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/public/classes?tenantDomain=elite-combat.jiu-jitsu.com" -Method Get
    Write-Success "Public classes endpoint working"
} catch {
    Write-Error "Public classes endpoint failed: $($_.Exception.Message)"
}

# Step 7: Summary
Write-Host ""
Write-Host "🎉 User Story 1 Testing Summary" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Elite Combat Academy created with:" -ForegroundColor Green
Write-Host "   🏢 Professional license (1 year)" -ForegroundColor White
Write-Host "   👥 25 users (1 system manager, 1 branch manager, 3 coaches, 20 students)" -ForegroundColor White
Write-Host "   📅 5 sample classes" -ForegroundColor White
Write-Host "   🏢 1 branch (Main Dojo)" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Test Credentials:" -ForegroundColor Yellow
Write-Host "   System Manager: admin@elite-combat.com / EliteAdmin2024!" -ForegroundColor White
Write-Host "   Branch Manager: manager@elite-combat.com / EliteManager2024!" -ForegroundColor White
Write-Host "   Coach: marcus@elite-combat.com / EliteCoach2024!" -ForegroundColor White
Write-Host "   Student: emma.w@email.com / EliteStudent2024!" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000/login" -ForegroundColor White
Write-Host "   Public Portal: http://localhost:3001/public?tenantDomain=elite-combat.jiu-jitsu.com" -ForegroundColor White
Write-Host "   API: http://localhost:3001/api" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Test frontend login with the credentials above" -ForegroundColor White
Write-Host "   2. Verify data isolation between tenants" -ForegroundColor White
Write-Host "   3. Test all CRUD operations" -ForegroundColor White
Write-Host "   4. Test public booking system" -ForegroundColor White
Write-Host ""
Write-Success "User Story 1 testing completed! 🚀"

Set-Location ..
