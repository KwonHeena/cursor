# 로컬에서 실행하기

## 빠른 시작

### 1. 백엔드 실행

터미널 1 (백엔드):
```bash
cd backend
npm install  # 처음 한 번만
npm run dev
```

백엔드가 `http://localhost:3001`에서 실행됩니다.

### 2. 프론트엔드 실행

터미널 2 (프론트엔드):
```bash
cd frontend
npm install  # 처음 한 번만
npm run dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

### 3. 브라우저에서 확인

브라우저에서 `http://localhost:5173` 접속

## Windows PowerShell에서 실행

### 방법 1: 두 개의 PowerShell 창 사용

**PowerShell 창 1 (백엔드):**
```powershell
cd C:\Users\LINE\Desktop\attendance-system\backend
npm run dev
```

**PowerShell 창 2 (프론트엔드):**
```powershell
cd C:\Users\LINE\Desktop\attendance-system\frontend
npm run dev
```

### 방법 2: 백그라운드 실행

```powershell
# 백엔드를 백그라운드로 실행
cd C:\Users\LINE\Desktop\attendance-system\backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# 프론트엔드를 백그라운드로 실행
cd C:\Users\LINE\Desktop\attendance-system\frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
```

## 확인 사항

### 백엔드 확인
- 브라우저에서 `http://localhost:3001` 접속
- `{"message":"학원 출결관리 시스템 API"}` 메시지가 보이면 정상

### 프론트엔드 확인
- 브라우저에서 `http://localhost:5173` 접속
- 학원 출결관리 시스템 화면이 보이면 정상

## 문제 해결

### 포트가 이미 사용 중인 경우
```bash
# 다른 포트 사용
# backend/.env 파일에서 PORT=3002로 변경
# frontend/.env 파일에서 VITE_API_URL=http://localhost:3002/api로 변경
```

### CORS 오류
백엔드 `server.js`에서 CORS 설정 확인

### 데이터베이스 오류
`database/attendance.db` 파일이 자동 생성됩니다.

