# GCP 클라우드 쉘로 파일 업로드 방법

로컬에 만들어진 프로젝트를 GCP 클라우드 쉘로 업로드하는 여러 방법을 안내합니다.

## 방법 1: 클라우드 쉘 파일 업로드 기능 (가장 쉬움)

### Step 1: 프로젝트 압축
로컬에서 프로젝트 폴더를 zip으로 압축:

**Windows (PowerShell):**
```powershell
cd C:\Users\LINE\Desktop
Compress-Archive -Path attendance-system -DestinationPath attendance-system.zip
```

**또는 수동으로:**
1. `attendance-system` 폴더 우클릭
2. "압축" 또는 "Send to > Compressed folder" 선택
3. `attendance-system.zip` 파일 생성 확인

### Step 2: 클라우드 쉘에서 업로드
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 우측 상단 **클라우드 쉘 아이콘** 클릭
3. 클라우드 쉘 상단의 **⋮ (점 3개) 메뉴** 클릭
4. **파일 업로드** 선택
5. `attendance-system.zip` 파일 선택
6. 업로드 완료 대기

### Step 3: 압축 해제
클라우드 쉘에서:
```bash
# 업로드된 파일 확인
ls -la

# 압축 해제
unzip attendance-system.zip

# 폴더로 이동
cd attendance-system

# 파일 확인
ls -la
```

## 방법 2: GitHub 사용 (권장 - 버전 관리)

### Step 1: GitHub 저장소 생성
1. [GitHub](https://github.com) 접속
2. 새 저장소 생성 (예: `attendance-system`)
3. 저장소 URL 복사

### Step 2: 로컬에서 Git 초기화 및 푸시
로컬 PowerShell에서:
```powershell
cd C:\Users\LINE\Desktop\attendance-system

# Git 초기화
git init

# .gitignore 확인 (이미 있음)
git add .

# 첫 커밋
git commit -m "Initial commit"

# GitHub 저장소 추가 (YOUR_USERNAME과 REPO_NAME 변경)
git remote add origin https://github.com/YOUR_USERNAME/attendance-system.git

# 푸시
git branch -M main
git push -u origin main
```

### Step 3: 클라우드 쉘에서 클론
클라우드 쉘에서:
```bash
# GitHub에서 클론
git clone https://github.com/YOUR_USERNAME/attendance-system.git

# 폴더로 이동
cd attendance-system

# 파일 확인
ls -la
```

## 방법 3: Cloud Storage 사용

### Step 1: 로컬에서 Cloud Storage에 업로드
로컬 PowerShell에서:
```powershell
cd C:\Users\LINE\Desktop

# 압축 (위에서 이미 했다면 생략)
Compress-Archive -Path attendance-system -DestinationPath attendance-system.zip

# gcloud CLI 설치 확인 (없으면 설치 필요)
# https://cloud.google.com/sdk/docs/install

# 버킷 생성 (한 번만)
gcloud storage buckets create gs://attendance-system-upload

# 파일 업로드
gcloud storage cp attendance-system.zip gs://attendance-system-upload/
```

### Step 2: 클라우드 쉘에서 다운로드
클라우드 쉘에서:
```bash
# 파일 다운로드
gcloud storage cp gs://attendance-system-upload/attendance-system.zip .

# 압축 해제
unzip attendance-system.zip

# 폴더로 이동
cd attendance-system
```

## 방법 4: 직접 복사/붙여넣기 (소규모 파일)

작은 파일들은 클라우드 쉘 에디터에서 직접 만들 수 있습니다:

1. 클라우드 쉘 상단 **에디터 열기** 버튼 클릭
2. 새 파일 생성
3. 로컬 파일 내용 복사하여 붙여넣기

**주의**: 이 방법은 파일이 많을 경우 비효율적입니다.

## 방법 5: gcloud compute scp 사용 (VM이 있는 경우)

VM 인스턴스가 있다면:
```bash
# 로컬에서
gcloud compute scp --recurse attendance-system VM_NAME:~/
```

## 추천 방법

- **개인 프로젝트**: 방법 1 (파일 업로드) - 가장 빠름
- **버전 관리 필요**: 방법 2 (GitHub) - 가장 권장
- **대용량 파일**: 방법 3 (Cloud Storage)

## 업로드 후 확인

클라우드 쉘에서:
```bash
cd attendance-system

# 폴더 구조 확인
tree -L 2

# 또는
ls -la
ls -la backend/
ls -la frontend/

# 주요 파일 확인
cat backend/package.json
cat frontend/package.json
```

## 다음 단계

파일 업로드가 완료되면 배포를 진행하세요:

```bash
# 백엔드 배포
cd backend
gcloud run deploy attendance-backend \
  --source . \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated
```

자세한 배포 방법은 `CLOUD_SHELL_STEPS.md`를 참고하세요.

