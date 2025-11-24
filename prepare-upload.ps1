# GCP 클라우드 쉘 업로드용 파일 준비 스크립트
# 사용법: .\prepare-upload.ps1

Write-Host "📦 클라우드 쉘 업로드용 파일 준비 중..." -ForegroundColor Green

# 현재 디렉토리 확인
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

# 임시 폴더 생성
$tempFolder = "attendance-system-upload"
if (Test-Path $tempFolder) {
    Remove-Item -Recurse -Force $tempFolder
}
New-Item -ItemType Directory -Path $tempFolder | Out-Null

Write-Host "✅ 임시 폴더 생성 완료" -ForegroundColor Green

# 필요한 파일만 복사
Write-Host "📋 파일 복사 중..." -ForegroundColor Yellow

# 백엔드 파일 복사
Write-Host "  - backend 폴더 복사 중..." -ForegroundColor Cyan
$backendDest = Join-Path $tempFolder "backend"
New-Item -ItemType Directory -Path $backendDest | Out-Null
Copy-Item -Path "backend\*" -Destination $backendDest -Recurse -Exclude "node_modules","*.db","*.db-journal",".env"

# 프론트엔드 파일 복사
Write-Host "  - frontend 폴더 복사 중..." -ForegroundColor Cyan
$frontendDest = Join-Path $tempFolder "frontend"
New-Item -ItemType Directory -Path $frontendDest | Out-Null
Copy-Item -Path "frontend\*" -Destination $frontendDest -Recurse -Exclude "node_modules","dist",".env"

# 루트 파일 복사
Write-Host "  - 루트 파일 복사 중..." -ForegroundColor Cyan
Copy-Item -Path "README.md" -Destination $tempFolder -ErrorAction SilentlyContinue
Copy-Item -Path "CLOUD_SHELL_STEPS.md" -Destination $tempFolder -ErrorAction SilentlyContinue
Copy-Item -Path "UPLOAD_TO_CLOUD_SHELL.md" -Destination $tempFolder -ErrorAction SilentlyContinue
Copy-Item -Path "cloud-shell-quick.sh" -Destination $tempFolder -ErrorAction SilentlyContinue
Copy-Item -Path ".gitignore" -Destination $tempFolder -ErrorAction SilentlyContinue

# database 폴더 생성 (빈 폴더)
Write-Host "  - database 폴더 생성 중..." -ForegroundColor Cyan
$dbDest = Join-Path $tempFolder "database"
New-Item -ItemType Directory -Path $dbDest | Out-Null
New-Item -ItemType File -Path (Join-Path $dbDest ".gitkeep") | Out-Null

Write-Host "✅ 파일 복사 완료" -ForegroundColor Green

# 압축
Write-Host "🗜️  압축 중..." -ForegroundColor Yellow
$zipFile = "attendance-system-upload.zip"
if (Test-Path $zipFile) {
    Remove-Item -Force $zipFile
}

Compress-Archive -Path $tempFolder -DestinationPath $zipFile -CompressionLevel Optimal

Write-Host "✅ 압축 완료: $zipFile" -ForegroundColor Green

# 임시 폴더 삭제
Remove-Item -Recurse -Force $tempFolder

# 파일 크기 확인
$fileSize = (Get-Item $zipFile).Length / 1MB
Write-Host ""
Write-Host "✨ 준비 완료!" -ForegroundColor Green
Write-Host "📦 파일: $zipFile" -ForegroundColor Cyan
Write-Host "📊 크기: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Yellow
Write-Host "1. GCP 클라우드 쉘 열기" -ForegroundColor White
Write-Host "2. 파일 업로드 버튼 클릭" -ForegroundColor White
Write-Host "3. $zipFile 파일 선택하여 업로드" -ForegroundColor White
Write-Host "4. Cloud Shell: unzip attendance-system-upload.zip" -ForegroundColor White

