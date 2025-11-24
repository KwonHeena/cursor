# Vercel 배포 실패 해결 방법

## 문제 원인

Vercel 서버리스 환경에서는 SQLite 파일 시스템 접근이 제한됩니다. `/tmp` 디렉토리도 각 요청마다 초기화될 수 있습니다.

## 해결 방법: 인메모리 데이터베이스

Vercel 환경에서는 인메모리 데이터베이스를 사용하도록 수정했습니다.

### 변경 사항

1. **db.js**: Vercel 환경 감지 시 `db-vercel.js` 사용
2. **db-vercel.js**: 인메모리 데이터베이스 구현 (새 파일)

### 배포 방법

1. **GitHub에 푸시**
   ```bash
   git add .
   git commit -m "Add in-memory database for Vercel"
   git push
   ```

2. **Vercel 자동 재배포**
   - GitHub에 푸시하면 자동으로 재배포됩니다

3. **테스트**
   - 백엔드 URL 접속 확인
   - API 테스트: `/api/students`
   - 프론트엔드에서 데이터 로드 확인

## 주의사항

### 인메모리 데이터베이스의 한계

⚠️ **데이터가 영구 저장되지 않습니다!**

- 서버 재시작 시 데이터가 사라집니다
- 각 요청마다 새로운 인스턴스가 생성될 수 있습니다
- 테스트/데모용으로만 사용하세요

### 프로덕션 환경 권장사항

영구 저장이 필요하면 다음을 사용하세요:

1. **Vercel Postgres** (추천)
   - Vercel 대시보드에서 추가 가능
   - 무료 티어 제공

2. **Supabase**
   - PostgreSQL 기반
   - 무료 티어 제공

3. **Railway / Render**
   - 백엔드를 별도로 배포
   - SQLite 사용 가능

## 현재 상태

- ✅ Vercel에서 작동 (인메모리 DB)
- ⚠️ 데이터 영구 저장 안 됨
- ✅ 로컬에서는 SQLite 정상 작동

## 다음 단계

프로덕션 배포를 원하면 Vercel Postgres를 설정하는 것을 권장합니다!

