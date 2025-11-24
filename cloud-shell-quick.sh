#!/bin/bash

# GCP 클라우드 쉘 빠른 배포 스크립트
# 사용법: bash cloud-shell-quick.sh

set -e  # 에러 발생 시 중단

echo "🚀 학원 출결관리 시스템 배포를 시작합니다..."

# 1. 프로젝트 확인
echo ""
echo "📋 현재 프로젝트 확인 중..."
PROJECT_ID=$(gcloud config get-value project)
echo "현재 프로젝트: $PROJECT_ID"

# 2. 필요한 API 활성화
echo ""
echo "🔧 필요한 API 활성화 중..."
gcloud services enable run.googleapis.com --quiet
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable firebasehosting.googleapis.com --quiet
echo "✅ API 활성화 완료"

# 3. 백엔드 배포
echo ""
echo "🔨 백엔드 배포 중..."
cd backend

gcloud run deploy attendance-backend \
  --source . \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --port 8080 \
  --quiet

# 백엔드 URL 가져오기
BACKEND_URL=$(gcloud run services describe attendance-backend \
  --platform managed \
  --region asia-northeast3 \
  --format 'value(status.url)')

echo "✅ 백엔드 배포 완료: $BACKEND_URL"

# 4. 프론트엔드 설정
echo ""
echo "🎨 프론트엔드 설정 중..."
cd ../frontend

# Firebase CLI 설치 확인
if ! command -v firebase &> /dev/null; then
  echo "Firebase CLI 설치 중..."
  npm install -g firebase-tools
fi

# 환경 변수 설정
echo "VITE_API_URL=${BACKEND_URL}/api" > .env.production
echo "✅ 환경 변수 설정 완료: VITE_API_URL=${BACKEND_URL}/api"

# 5. 빌드
echo ""
echo "📦 프론트엔드 빌드 중..."
npm install
npm run build
echo "✅ 빌드 완료"

# 6. Firebase 배포 (수동 확인 필요)
echo ""
echo "🌐 Firebase 배포 준비 완료"
echo ""
echo "다음 명령어를 실행하세요:"
echo "  cd frontend"
echo "  firebase login --no-localhost"
echo "  firebase init hosting"
echo "    - Use an existing project: Yes"
echo "    - Public directory: dist"
echo "    - Single-page app: Yes"
echo "  firebase deploy --only hosting"
echo ""
echo "또는 이미 Firebase가 설정되어 있다면:"
echo "  cd frontend"
echo "  firebase deploy --only hosting"

echo ""
echo "✨ 배포 준비 완료!"
echo "백엔드 URL: $BACKEND_URL"

