# Vercel 배포 문제 해결 가이드

## 문제: 데이터를 불러올 수 없음

### 원인
Vercel은 서버리스 환경이므로 파일 시스템이 읽기 전용입니다. 일반 경로에 SQLite 파일을 저장할 수 없습니다.

### 해결 방법

#### 1. 데이터베이스 경로 수정 (이미 적용됨)
`backend/db.js`에서 Vercel 환경일 때 `/tmp` 디렉토리를 사용하도록 수정했습니다.

#### 2. CORS 설정 확인
`backend/server.js`에서 프론트엔드 URL이 올바르게 설정되어 있는지 확인하세요.

#### 3. 환경 변수 확인
Vercel 대시보드에서 환경 변수가 올바르게 설정되어 있는지 확인:
- `PORT=3001` (백엔드)
- `VITE_API_URL=https://your-backend-url.vercel.app/api` (프론트엔드)

#### 4. 재배포
코드 수정 후 GitHub에 푸시하면 자동으로 재배포됩니다:

```bash
git add .
git commit -m "Fix database path for Vercel"
git push
```

## 주의사항

### SQLite의 한계
- Vercel 서버리스 환경에서는 각 요청마다 새로운 인스턴스가 생성될 수 있습니다
- `/tmp` 디렉토리는 임시 저장이므로 데이터가 유지되지 않을 수 있습니다
- 프로덕션 환경에서는 PostgreSQL 같은 영구 데이터베이스를 사용하는 것을 권장합니다

### 임시 해결책
현재는 `/tmp` 디렉토리를 사용하지만, 데이터가 영구적으로 저장되지 않을 수 있습니다.

### 영구 저장이 필요한 경우
1. **Vercel Postgres** 사용 (추천)
2. **Supabase** 사용
3. **Railway** 또는 **Render**로 백엔드 배포

## 로그 확인

Vercel 대시보드에서 Functions 탭을 통해 로그를 확인할 수 있습니다:
- 에러 메시지 확인
- 데이터베이스 연결 상태 확인

## 테스트

배포 후 다음을 확인하세요:
1. 백엔드 URL 접속: `https://your-backend.vercel.app/`
2. API 테스트: `https://your-backend.vercel.app/api/students`
3. 프론트엔드에서 데이터 로드 확인

