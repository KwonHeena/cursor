# 빠른 배포 가이드 (5분 안에!)

## 가장 쉬운 방법: Vercel 사용

### 1단계: GitHub에 업로드

```bash
cd attendance-system

# Git 초기화
git init
git add .
git commit -m "Initial commit"

# GitHub 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/attendance-system.git
git branch -M main
git push -u origin main
```

### 2단계: Vercel 배포

1. **Vercel 가입**: [vercel.com](https://vercel.com) → GitHub로 로그인

2. **백엔드 배포**
   - "Add New Project" 클릭
   - 저장소 선택
   - **Root Directory**: `backend` 선택
   - **Framework**: Other
   - **Environment Variables**: `PORT=3001`
   - 배포 완료 후 URL 복사 (예: `https://attendance-backend-xxx.vercel.app`)

3. **프론트엔드 배포**
   - "Add New Project" 클릭
   - 같은 저장소 선택
   - **Root Directory**: `frontend` 선택
   - **Framework**: Vite (자동 감지)
   - **Environment Variables**: 
     ```
     VITE_API_URL=https://attendance-backend-xxx.vercel.app/api
     ```
   - 배포 완료!

### 3단계: 완료!

프론트엔드 URL을 공유하면 다른 사람도 접속할 수 있습니다!

## 자동 배포

GitHub에 푸시하면 자동으로 재배포됩니다:

```bash
git add .
git commit -m "Update"
git push
```

## 다른 배포 옵션

- **Netlify + Railway**: `GITHUB_DEPLOY.md` 참고
- **GitHub Pages**: 프론트엔드만 (정적 사이트)
- **Render**: 전체 스택 무료 배포

자세한 내용은 `DEPLOY_VERCEL.md`를 참고하세요!

