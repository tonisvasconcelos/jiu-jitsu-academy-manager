# Start Backend Server Script
Write-Host "🚀 Starting Jiu-Jitsu Academy Manager Backend Server..." -ForegroundColor Green

# Set environment variables
$env:DB_HOST = "ep-steep-tooth-ac14qe2b-pooler.sa-east-1.aws.neon.tech"
$env:DB_NAME = "neondb"
$env:DB_USER = "neondb_owner"
$env:DB_PASSWORD = "npg_5NJmWgEc4rtU"
$env:JWT_SECRET = "your-super-secret-jwt-key-here-oss365-production"
$env:PORT = "5000"
$env:NODE_ENV = "development"

Write-Host "📊 Environment variables set:" -ForegroundColor Yellow
Write-Host "  DB_HOST: $env:DB_HOST" -ForegroundColor Cyan
Write-Host "  DB_NAME: $env:DB_NAME" -ForegroundColor Cyan
Write-Host "  PORT: $env:PORT" -ForegroundColor Cyan
Write-Host "  NODE_ENV: $env:NODE_ENV" -ForegroundColor Cyan

# Change to server directory
Set-Location server

Write-Host "📁 Changed to server directory" -ForegroundColor Yellow

# Build the project
Write-Host "🔨 Building TypeScript project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Start the server
    Write-Host "🚀 Starting server on port 5000..." -ForegroundColor Yellow
    npm start
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
