# Simple Testing Script for User Story 1
# This script will guide you through testing step by step

Write-Host "🎯 User Story 1: Simple Testing Guide" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will help you test User Story 1 step by step." -ForegroundColor Yellow
Write-Host ""

# Step 1: Check if we're in the right directory
if (-not (Test-Path "server/package.json")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "   (The folder that contains both 'server' and 'src' folders)" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found project structure" -ForegroundColor Green
Write-Host ""

# Step 2: Navigate to server directory
Write-Host "📁 Step 1: Setting up the backend..." -ForegroundColor Blue
Set-Location server

# Step 3: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Step 4: Create .env file
Write-Host "⚙️ Creating environment file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item "env.example" ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Step 5: Set up SQLite database
Write-Host "🗄️ Setting up SQLite database..." -ForegroundColor Yellow
npm run setup-sqlite
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to set up database" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database set up successfully" -ForegroundColor Green

# Step 6: Start the backend server
Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
Write-Host "   The server will start in the background" -ForegroundColor Cyan
Write-Host "   Keep this window open!" -ForegroundColor Yellow
Write-Host ""

# Start the server in background
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; npm run dev" -WindowStyle Minimized

# Wait a moment for server to start
Start-Sleep -Seconds 3

Write-Host "✅ Backend server started" -ForegroundColor Green
Write-Host ""

# Step 7: Instructions for frontend
Write-Host "🌐 Step 2: Testing the frontend..." -ForegroundColor Blue
Write-Host ""
Write-Host "Now you need to:" -ForegroundColor Yellow
Write-Host "1. Open a NEW PowerShell window" -ForegroundColor White
Write-Host "2. Navigate to the project root: cd .." -ForegroundColor White
Write-Host "3. Start the React app: npm run dev" -ForegroundColor White
Write-Host "4. Open your browser to: http://localhost:5173/login" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Test Credentials:" -ForegroundColor Cyan
Write-Host "   Domain: elite-combat.jiu-jitsu.com" -ForegroundColor White
Write-Host "   Email: admin@elite-combat.com" -ForegroundColor White
Write-Host "   Password: EliteAdmin2024!" -ForegroundColor White
Write-Host ""
Write-Host "✅ What to expect:" -ForegroundColor Green
Write-Host "   - Login should work" -ForegroundColor White
Write-Host "   - You should see Elite Combat Academy dashboard" -ForegroundColor White
Write-Host "   - 20 students should be visible in Students section" -ForegroundColor White
Write-Host "   - 5 classes should be visible in Classes section" -ForegroundColor White
Write-Host ""
Write-Host "🎉 User Story 1 Testing Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Set-Location ..
