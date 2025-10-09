# Test Login Script
Write-Host "🧪 Testing User Story 1 Login..." -ForegroundColor Cyan

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Test the login endpoint
Write-Host "🔐 Testing login endpoint..." -ForegroundColor Yellow

try {
    $body = @{
        domain = "elite-combat.jiu-jitsu.com"
        email = "admin@elite-combat.com"
        password = "EliteAdmin2024!"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body $body

    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor White

} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 Frontend URLs:" -ForegroundColor Cyan
Write-Host "   Login: http://localhost:3001/jiu-jitsu-academy-manager/login" -ForegroundColor White
Write-Host "   Dashboard: http://localhost:3001/jiu-jitsu-academy-manager/" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Test Credentials:" -ForegroundColor Yellow
Write-Host "   Domain: elite-combat.jiu-jitsu.com" -ForegroundColor White
Write-Host "   Email: admin@elite-combat.com" -ForegroundColor White
Write-Host "   Password: EliteAdmin2024!" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Ready to test User Story 1!" -ForegroundColor Green
