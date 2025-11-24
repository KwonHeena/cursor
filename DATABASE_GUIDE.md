# 데이터베이스 확인 가이드

## 데이터베이스 위치

SQLite 데이터베이스 파일은 다음 위치에 저장됩니다:

```
attendance-system/database/attendance.db
```

## 확인 방법

### 방법 1: DBeaver 사용 (권장)

#### 1. DBeaver 설치
- [DBeaver 다운로드](https://dbeaver.io/download/)
- Community Edition (무료) 다운로드 및 설치

#### 2. SQLite 연결 설정

1. DBeaver 실행
2. **데이터베이스** → **새 데이터베이스 연결** 클릭
3. **SQLite** 선택 → **다음**
4. **경로**에서 `attendance.db` 파일 선택:
   ```
   C:\Users\LINE\Desktop\attendance-system\database\attendance.db
   ```
5. **완료** 클릭

#### 3. 데이터 확인

연결 후 다음 테이블을 확인할 수 있습니다:

- **students**: 학생 정보
  - id (INTEGER, PRIMARY KEY)
  - name (TEXT)
  - classroom (INTEGER, 1-5)
  - created_at (DATETIME)

- **attendance**: 출결 기록
  - id (INTEGER, PRIMARY KEY)
  - student_id (INTEGER, FOREIGN KEY)
  - date (TEXT)
  - status (TEXT: '출석', '결석', '지각', '조퇴')
  - created_at (DATETIME)

#### 4. 쿼리 실행

DBeaver에서 SQL 쿼리를 실행할 수 있습니다:

```sql
-- 모든 학생 조회
SELECT * FROM students;

-- 특정 교실 학생 조회
SELECT * FROM students WHERE classroom = 1;

-- 출결 기록 조회
SELECT 
  s.name,
  s.classroom,
  a.date,
  a.status
FROM attendance a
JOIN students s ON a.student_id = s.id
ORDER BY a.date DESC;

-- 교실별 출결 통계
SELECT 
  s.classroom,
  a.status,
  COUNT(*) as count
FROM attendance a
JOIN students s ON a.student_id = s.id
GROUP BY s.classroom, a.status;
```

### 방법 2: SQLite 명령줄 도구

#### SQLite 설치
- [SQLite 다운로드](https://www.sqlite.org/download.html)
- 또는 Chocolatey 사용: `choco install sqlite`

#### 사용 방법

```bash
# 데이터베이스 파일로 이동
cd C:\Users\LINE\Desktop\attendance-system\database

# SQLite 실행
sqlite3 attendance.db

# SQL 쿼리 실행
.tables                    # 테이블 목록
.schema students          # students 테이블 구조
SELECT * FROM students;   # 모든 학생 조회
.quit                     # 종료
```

### 방법 3: VS Code 확장 프로그램

1. VS Code에서 **SQLite Viewer** 또는 **SQLite** 확장 설치
2. `attendance.db` 파일을 VS Code에서 열기
3. 테이블과 데이터 확인

### 방법 4: 온라인 SQLite 뷰어

1. [SQLite Viewer](https://sqliteviewer.app/) 접속
2. `attendance.db` 파일 업로드
3. 데이터 확인

## 데이터베이스 파일 생성 시점

데이터베이스 파일은 **백엔드 서버가 처음 실행될 때** 자동으로 생성됩니다.

```bash
cd backend
npm run dev
```

서버가 시작되면 `database/attendance.db` 파일이 생성됩니다.

## 데이터베이스 초기화

데이터베이스를 초기화하려면:

```bash
# 데이터베이스 파일 삭제
rm database/attendance.db

# 백엔드 서버 재시작 (자동으로 새로 생성됨)
cd backend
npm run dev
```

## 백업 및 복원

### 백업
```bash
# 데이터베이스 파일 복사
copy database\attendance.db database\attendance_backup.db
```

### 복원
```bash
# 백업 파일로 복원
copy database\attendance_backup.db database\attendance.db
```

## 주의사항

1. **서버 실행 중에는 파일이 잠길 수 있음**
   - DBeaver에서 읽기 전용 모드로 열기
   - 또는 서버를 중지한 후 확인

2. **데이터 손실 주의**
   - 데이터베이스 파일을 삭제하면 모든 데이터가 사라집니다
   - 정기적으로 백업 권장

3. **GCP 배포 시**
   - Cloud Run에서는 임시 스토리지에 저장됨
   - 영구 저장이 필요하면 Cloud SQL 사용 권장

## 유용한 SQL 쿼리

### 학생 추가 확인
```sql
SELECT * FROM students ORDER BY created_at DESC;
```

### 오늘 출결 현황
```sql
SELECT 
  s.name,
  s.classroom,
  a.status
FROM attendance a
JOIN students s ON a.student_id = s.id
WHERE a.date = date('now')
ORDER BY s.classroom, s.name;
```

### 교실별 학생 수
```sql
SELECT 
  classroom,
  COUNT(*) as student_count
FROM students
GROUP BY classroom
ORDER BY classroom;
```

### 출결 통계 (최근 7일)
```sql
SELECT 
  a.status,
  COUNT(*) as count
FROM attendance a
WHERE a.date >= date('now', '-7 days')
GROUP BY a.status;
```

