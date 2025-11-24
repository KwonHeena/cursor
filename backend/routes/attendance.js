const express = require('express');
const router = express.Router();
const { dbQuery, dbRun } = require('../db');

// 출결 기록 추가/수정
router.post('/', async (req, res) => {
  try {
    const { student_id, date, status } = req.body;
    
    if (!student_id || !date || !status) {
      return res.status(400).json({ error: '학생 ID, 날짜, 출결 상태는 필수입니다.' });
    }
    
    const validStatuses = ['출석', '결석', '지각', '조퇴'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: '유효하지 않은 출결 상태입니다.' });
    }
    
    // 이미 기록이 있으면 업데이트, 없으면 삽입
    const existing = await dbQuery(
      'SELECT * FROM attendance WHERE student_id = ? AND date = ?',
      [student_id, date]
    );
    
    if (existing.length > 0) {
      await dbRun(
        'UPDATE attendance SET status = ? WHERE student_id = ? AND date = ?',
        [status, student_id, date]
      );
    } else {
      await dbRun(
        'INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)',
        [student_id, date, status]
      );
    }
    
    const record = await dbQuery(
      'SELECT * FROM attendance WHERE student_id = ? AND date = ?',
      [student_id, date]
    );
    
    res.json(record[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 학생의 출결 기록 조회
router.get('/student/:student_id', async (req, res) => {
  try {
    const student_id = parseInt(req.params.student_id);
    const records = await dbQuery(
      'SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC',
      [student_id]
    );
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 날짜의 출결 기록 조회
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const records = await dbQuery(
      `SELECT a.*, s.name, s.classroom 
       FROM attendance a 
       JOIN students s ON a.student_id = s.id 
       WHERE a.date = ? 
       ORDER BY s.classroom, s.name`,
      [date]
    );
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

