# Vercel 배포 가이드 (가장 쉬운 방법)

Vercel을 사용하면 프론트엔드와 백엔드를 모두 무료로 배포할 수 있습니다.

## 1단계: GitHub에 코드 업로드

```bash
cd attendance-system

# Git 초기화 (아직 안 했다면)
git init

# .gitignore 확인
# node_modules, .env 등이 제외되어 있는지 확인

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit"

# GitHub 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/attendance-system.git
git branch -M main
git push -u origin main
```

## 2단계: Vercel에 백엔드 배포

1. **Vercel 가입**
   - [vercel.com](https://vercel.com) 접속
   - "Sign Up" → GitHub 계정으로 로그인

2. **백엔드 프로젝트 생성**
   - 대시보드에서 "Add New Project" 클릭
   - GitHub 저장소 선택
   - **Project Name**: `attendance-backend`
   - **Root Directory**: `backend` 선택 (중요!)
   - **Framework Preset**: Other
   - **Build Command**: (비워두기)
   - **Output Directory**: (비워두기)
   - **Install Command**: `npm install`
   - **Environment Variables** 추가:
     ```
     PORT = 3001
     ```
   - "Deploy" 클릭

3. **백엔드 URL 확인**
   - 배포 완료 후 URL 확인 (예: `https://attendance-backend-xxxxx.vercel.app`)
   - 이 URL을 복사해두세요

## 3단계: Vercel에 프론트엔드 배포

1. **프론트엔드 프로젝트 생성**
   - "Add New Project" 클릭
   - 같은 GitHub 저장소 선택
   - **Project Name**: `attendance-frontend`
   - **Root Directory**: `frontend` 선택 (중요!)
   - **Framework Preset**: Vite 선택
   - **Build Command**: `npm run build` (자동 입력됨)
   - **Output Directory**: `dist` (자동 입력됨)
   - **Environment Variables** 추가:
     ```
     VITE_API_URL = https://attendance-backend-xxxxx.vercel.app/api
     ```
     (위에서 복사한 백엔드 URL 사용)
   - "Deploy" 클릭

## 4단계: CORS 설정

백엔드에서 프론트엔드 도메인을 허용해야 합니다.

`backend/server.js` 파일 수정:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://attendance-frontend-xxxxx.vercel.app',
    'https://attendance-frontend.vercel.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

수정 후 GitHub에 푸시하면 자동으로 재배포됩니다.

## 5단계: 확인

1. 프론트엔드 URL 접속
2. 학생 관리 기능 테스트
3. 출결 관리 기능 테스트
4. 통계 대시보드 확인

## 자동 배포

GitHub에 코드를 푸시하면 Vercel이 자동으로 재배포합니다!

```bash
git add .
git commit -m "Update code"
git push
```

## 커스텀 도메인

Vercel에서 Settings → Domains에서 커스텀 도메인을 추가할 수 있습니다.

## 문제 해결

### CORS 오류
- 백엔드 `server.js`에서 프론트엔드 URL이 CORS에 포함되어 있는지 확인

### API 연결 오류
- 프론트엔드 환경 변수 `VITE_API_URL`이 올바른지 확인
- Vercel에서 환경 변수 재설정 후 재배포

### 데이터베이스 오류
- SQLite는 임시 저장이므로, 영구 저장이 필요하면 PostgreSQL 사용 권장

