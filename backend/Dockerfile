FROM node:18-alpine

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 애플리케이션 코드 복사
COPY . .

# 포트 노출 (Cloud Run은 PORT 환경 변수를 자동으로 제공)
EXPOSE 8080

# 환경 변수 설정
ENV PORT=8080
ENV NODE_ENV=production

# 서버 시작
CMD ["node", "server.js"]

