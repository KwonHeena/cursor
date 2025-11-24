require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://cursor-iota-lilac.vercel.app',
    'https://cursor-front-tan.vercel.app',
    process.env.FRONTEND_URL,
    /\.vercel\.app$/,
    /\.netlify\.app$/,
    /\.github\.io$/
  ].filter(Boolean),
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// 라우트
const studentsRouter = require('./routes/students');
const attendanceRouter = require('./routes/attendance');
const statisticsRouter = require('./routes/statistics');

app.use('/api/students', studentsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/statistics', statisticsRouter);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '학원 출결관리 시스템 API' });
});

// Vercel 서버리스 환경 감지
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

// 서버 시작
async function startServer() {
  try {
    await initDatabase();
    
    // Vercel 환경에서는 app.listen 불필요 (서버리스 함수로 작동)
    if (!isVercel) {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
      });
    } else {
      console.log('Vercel 서버리스 환경에서 실행 중입니다.');
    }
  } catch (error) {
    console.error('서버 시작 실패:', error);
    if (!isVercel) {
      process.exit(1);
    }
  }
}

// Vercel이 아닌 환경에서만 직접 서버 시작
if (!isVercel) {
  startServer();
} else {
  // Vercel 환경에서는 데이터베이스만 초기화
  initDatabase().catch(console.error);
}

// Vercel 서버리스 함수로 export
module.exports = app;

