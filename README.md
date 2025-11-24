# 학원 출결관리 시스템

React + Vite, Node.js, SQLite를 사용한 학원 출결관리 시스템입니다.

## 기능

- **학생 관리**: 학생 추가, 삭제, 교실별 조회
- **출결 관리**: 출석, 결석, 지각, 조퇴 기록
- **통계 대시보드**: 교실별 출결 현황 그래프

## 프로젝트 구조

```
attendance-system/
├── frontend/          # React + Vite 프론트엔드
├── backend/           # Node.js + Express 백엔드
└── database/          # SQLite 데이터베이스 파일
```

## 설치 및 실행

### 백엔드 실행

```bash
cd backend
npm install
npm run dev
```

백엔드 서버는 `http://localhost:3001`에서 실행됩니다.

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

프론트엔드 서버는 `http://localhost:5173`에서 실행됩니다.

## 데이터베이스

SQLite 데이터베이스는 `database/attendance.db`에 자동으로 생성됩니다.
DBeaver를 사용하여 데이터베이스를 확인하고 관리할 수 있습니다.

### 테이블 구조

- **students**: 학생 정보 (id, name, classroom, created_at)
- **attendance**: 출결 기록 (id, student_id, date, status, created_at)

## API 엔드포인트

### 학생 API
- `GET /api/students` - 모든 학생 조회
- `GET /api/students/classroom/:classroom` - 특정 교실 학생 조회
- `POST /api/students` - 학생 추가
- `DELETE /api/students/:id` - 학생 삭제

### 출결 API
- `POST /api/attendance` - 출결 기록 추가/수정
- `GET /api/attendance/student/:student_id` - 학생별 출결 기록
- `GET /api/attendance/date/:date` - 날짜별 출결 기록

### 통계 API
- `GET /api/statistics/classroom/:classroom` - 교실별 통계
- `GET /api/statistics/all` - 모든 교실 통계

## 사용 방법

1. **학생 관리** 탭에서 학생을 추가합니다.
2. **출결 관리** 탭에서 교실과 날짜를 선택하고 출결을 기록합니다.
3. **통계 대시보드** 탭에서 교실을 선택하여 출결 현황을 그래프로 확인합니다.

## 기술 스택

- Frontend: React, Vite, Chart.js
- Backend: Node.js, Express
- Database: SQLite
- API: RESTful API

## 배포하기

다른 사람도 접속할 수 있도록 배포하는 방법:

- **가장 쉬운 방법**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Vercel 사용 (5분)
- **상세 가이드**: [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) - Vercel 상세 설명
- **다양한 옵션**: [GITHUB_DEPLOY.md](./GITHUB_DEPLOY.md) - 여러 배포 방법

## GCP 배포

GCP에 배포하는 방법은 다음 파일을 참고하세요:

- **클라우드 쉘 배포 (권장)**: [CLOUD_SHELL_DEPLOY.md](./CLOUD_SHELL_DEPLOY.md)
- **빠른 배포 스크립트**: `bash cloud-shell-quick.sh`

### 배포 아키텍처

- **백엔드**: Cloud Run (서버리스)
- **프론트엔드**: Firebase Hosting
- **데이터베이스**: SQLite (또는 Cloud SQL)

### 빠른 배포 명령어

```bash
# 백엔드 배포
cd backend
gcloud run deploy attendance-backend --source . --region asia-northeast3 --allow-unauthenticated

# 프론트엔드 배포
cd frontend
firebase init hosting
npm run build
firebase deploy --only hosting
```

