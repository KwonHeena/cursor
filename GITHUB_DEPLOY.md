# GitHub 배포 가이드

다른 사람도 접근할 수 있도록 GitHub에 배포하는 방법입니다.

## 방법 1: Vercel 배포 (가장 쉬움, 권장)

Vercel은 프론트엔드와 백엔드를 모두 무료로 배포할 수 있습니다.

### 프론트엔드 배포

1. **GitHub에 코드 업로드**
   ```bash
   cd attendance-system
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/attendance-system.git
   git push -u origin main
   ```

2. **Vercel 가입 및 배포**
   - [Vercel](https://vercel.com) 접속
   - GitHub 계정으로 로그인
   - "Add New Project" 클릭
   - GitHub 저장소 선택
   - **Root Directory**: `frontend` 선택
   - **Framework Preset**: Vite 선택
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://your-backend-url.vercel.app/api
     ```
   - "Deploy" 클릭

### 백엔드 배포

1. **Vercel에서 백엔드 프로젝트 추가**
   - "Add New Project" 클릭
   - 같은 GitHub 저장소 선택
   - **Root Directory**: `backend` 선택
   - **Framework Preset**: Other 선택
   - **Build Command**: (비워두기)
   - **Output Directory**: (비워두기)
   - **Install Command**: `npm install`
   - **Development Command**: `npm run dev`
   - **Environment Variables**:
     ```
     PORT=3001
     ```
   - "Deploy" 클릭

2. **프론트엔드 환경 변수 업데이트**
   - 프론트엔드 프로젝트의 Environment Variables 수정
   - `VITE_API_URL`을 백엔드 URL로 변경
   - 재배포

## 방법 2: Netlify + Railway

### 프론트엔드 (Netlify)

1. **Netlify 가입**
   - [Netlify](https://www.netlify.com) 접속
   - GitHub 계정으로 로그인

2. **배포 설정**
   - "Add new site" → "Import an existing project"
   - GitHub 저장소 선택
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Environment variables**:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```

### 백엔드 (Railway)

1. **Railway 가입**
   - [Railway](https://railway.app) 접속
   - GitHub 계정으로 로그인

2. **프로젝트 생성**
   - "New Project" → "Deploy from GitHub repo"
   - 저장소 선택
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

3. **환경 변수 설정**
   ```
   PORT=3001
   NODE_ENV=production
   ```

## 방법 3: GitHub Pages (프론트엔드만)

GitHub Pages는 정적 사이트만 배포 가능하므로 프론트엔드만 배포합니다.

### 설정

1. **vite.config.js 수정**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/attendance-system/', // 저장소 이름
   })
   ```

2. **GitHub Actions 워크플로우 생성**
   `.github/workflows/deploy.yml` 파일 생성:

   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         
         - name: Install dependencies
           run: |
             cd frontend
             npm install
         
         - name: Build
           run: |
             cd frontend
             npm run build
           env:
             VITE_API_URL: ${{ secrets.VITE_API_URL }}
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./frontend/dist
   ```

3. **GitHub 저장소 설정**
   - Settings → Pages
   - Source: GitHub Actions 선택

## 방법 4: Render (전체 스택)

Render는 프론트엔드와 백엔드를 모두 배포할 수 있습니다.

### 백엔드 배포

1. **Render 가입**
   - [Render](https://render.com) 접속
   - GitHub 계정으로 로그인

2. **Web Service 생성**
   - "New" → "Web Service"
   - GitHub 저장소 선택
   - **Name**: `attendance-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     PORT=3001
     NODE_ENV=production
     ```

### 프론트엔드 배포

1. **Static Site 생성**
   - "New" → "Static Site"
   - GitHub 저장소 선택
   - **Name**: `attendance-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://attendance-backend.onrender.com/api
     ```

## 추천 방법

**가장 쉬운 방법**: Vercel
- 프론트엔드와 백엔드 모두 무료 배포
- GitHub 연동으로 자동 배포
- 설정이 간단함

## 배포 후 확인

1. 프론트엔드 URL 접속
2. 학생 관리 기능 테스트
3. 출결 관리 기능 테스트
4. 통계 대시보드 확인

## 주의사항

1. **환경 변수**: 백엔드 URL을 프론트엔드 환경 변수에 설정
2. **CORS**: 백엔드에서 프론트엔드 도메인 허용
3. **데이터베이스**: SQLite는 임시 저장이므로, 영구 저장이 필요하면 PostgreSQL 사용 권장

