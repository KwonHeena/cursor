require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(cors());
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

// 서버 시작
async function startServer() {
  try {
    await initDatabase();
    // Cloud Run은 모든 IP에서 접근 가능하도록 '0.0.0.0' 바인딩
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

startServer();

