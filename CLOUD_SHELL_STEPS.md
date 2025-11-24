# 클라우드 쉘 단계별 가이드

## 📝 준비 단계

### 1. 클라우드 쉘 열기
- [Google Cloud Console](https://console.cloud.google.com) 접속
- 우측 상단 **클라우드 쉘 아이콘** 클릭
- 터미널이 열릴 때까지 대기

### 2. 코드 업로드 방법 선택

#### 방법 A: GitHub 사용 (가장 쉬움)
```bash
# GitHub에 코드 업로드 후
git clone https://github.com/YOUR_USERNAME/attendance-system.git
cd attendance-system
```

#### 방법 B: 직접 업로드
1. 로컬에서 프로젝트 폴더를 zip으로 압축
2. 클라우드 쉘 상단 **파일 업로드** 버튼 클릭
3. zip 파일 업로드
4. 압축 해제:
```bash
unzip attendance-system.zip
cd attendance-system
```

## 🚀 배포 단계

### Step 1: 프로젝트 설정
```bash
# 현재 프로젝트 확인
gcloud config get-value project

# 프로젝트 변경 (필요 시)
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: API 활성화
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable firebasehosting.googleapis.com
```

### Step 3: 백엔드 배포
```bash
cd backend

# Cloud Run에 배포
gcloud run deploy attendance-backend \
  --source . \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated

# 배포 완료 후 URL 복사 (예: https://attendance-backend-xxxxx.run.app)
```

**중요**: 배포 완료 후 나오는 **Service URL**을 복사해두세요!

### Step 4: 프론트엔드 설정
```bash
cd ../frontend

# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login --no-localhost
# 브라우저에서 인증 완료

# Firebase 초기화
firebase init hosting
```

초기화 시 선택:
- ✅ Use an existing project
- ✅ 현재 GCP 프로젝트 선택
- ✅ Public directory: `dist`
- ✅ Single-page app: `Yes`
- ✅ Set up automatic builds: `No`

### Step 5: 환경 변수 설정
```bash
# 위에서 복사한 백엔드 URL 사용
# 예: https://attendance-backend-xxxxx.run.app
BACKEND_URL="여기에_백엔드_URL_붙여넣기"

# .env.production 파일 생성
echo "VITE_API_URL=${BACKEND_URL}/api" > .env.production

# 확인
cat .env.production
```

### Step 6: 빌드 및 배포
```bash
# 의존성 설치
npm install

# 빌드
npm run build

# 배포
firebase deploy --only hosting
```

배포 완료! **Hosting URL**이 표시됩니다.

## ✅ 확인

1. 프론트엔드 URL 접속
2. 학생 추가 테스트
3. 출결 기록 테스트
4. 통계 대시보드 확인

## 🔄 재배포

### 백엔드 재배포
```bash
cd backend
gcloud run deploy attendance-backend --source . --region asia-northeast3
```

### 프론트엔드 재배포
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## 🐛 문제 해결

### 배포 실패 시
```bash
# 로그 확인
gcloud run services logs read attendance-backend \
  --region asia-northeast3 \
  --limit 50
```

### CORS 오류
백엔드 `server.js`에서 프론트엔드 URL이 CORS에 포함되어 있는지 확인

### 환경 변수 오류
`.env.production` 파일이 올바른지 확인:
```bash
cat frontend/.env.production
```

