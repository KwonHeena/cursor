# Simple upload preparation script
Write-Host "Preparing files for Cloud Shell upload..." -ForegroundColor Green

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

$tempFolder = "attendance-system-upload"
if (Test-Path $tempFolder) {
    Remove-Item -Recurse -Force $tempFolder
}
New-Item -ItemType Directory -Path $tempFolder | Out-Null

Write-Host "Copying backend files..." -ForegroundColor Yellow
$backendDest = Join-Path $tempFolder "backend"
New-Item -ItemType Directory -Path $backendDest | Out-Null
Copy-Item -Path "backend\*" -Destination $backendDest -Recurse -Exclude "node_modules","*.db","*.db-journal",".env"

Write-Host "Copying frontend files..." -ForegroundColor Yellow
$frontendDest = Join-Path $tempFolder "frontend"
New-Item -ItemType Directory -Path $frontendDest | Out-Null
Copy-Item -Path "frontend\*" -Destination $frontendDest -Recurse -Exclude "node_modules","dist",".env"

Write-Host "Copying root files..." -ForegroundColor Yellow
Copy-Item -Path "README.md" -Destination $tempFolder -ErrorAction SilentlyContinue
Copy-Item -Path "CLOUD_SHELL_STEPS.md" -Destination $tempFolder -ErrorAction SilentlyContinue
Copy-Item -Path "UPLOAD_TO_CLOUD_SHELL.md" -Destination $tempFolder -ErrorAction SilentlyContinue
Copy-Item -Path "cloud-shell-quick.sh" -Destination $tempFolder -ErrorAction SilentlyContinue
Copy-Item -Path ".gitignore" -Destination $tempFolder -ErrorAction SilentlyContinue

$dbDest = Join-Path $tempFolder "database"
New-Item -ItemType Directory -Path $dbDest | Out-Null

Write-Host "Creating zip file..." -ForegroundColor Yellow
$zipFile = "attendance-system-upload.zip"
if (Test-Path $zipFile) {
    Remove-Item -Force $zipFile
}

Compress-Archive -Path $tempFolder -DestinationPath $zipFile -CompressionLevel Optimal

Remove-Item -Recurse -Force $tempFolder

$fileSize = (Get-Item $zipFile).Length / 1MB
Write-Host ""
Write-Host "Done! File: $zipFile" -ForegroundColor Green
Write-Host "Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open GCP Cloud Shell" -ForegroundColor White
Write-Host "2. Click Upload button" -ForegroundColor White
Write-Host "3. Select $zipFile" -ForegroundColor White
Write-Host "4. Run: unzip attendance-system-upload.zip" -ForegroundColor White

