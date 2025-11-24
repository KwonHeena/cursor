const express = require('express');
const router = express.Router();
const { dbQuery, dbRun } = require('../db');

// 모든 학생 조회
router.get('/', async (req, res) => {
  try {
    const students = await dbQuery('SELECT * FROM students ORDER BY classroom, name');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 교실의 학생 조회
router.get('/classroom/:classroom', async (req, res) => {
  try {
    const classroom = parseInt(req.params.classroom);
    if (classroom < 1 || classroom > 5) {
      return res.status(400).json({ error: '교실 번호는 1-5 사이여야 합니다.' });
    }
    const students = await dbQuery(
      'SELECT * FROM students WHERE classroom = ? ORDER BY name',
      [classroom]
    );
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 학생 추가
router.post('/', async (req, res) => {
  try {
    const { name, classroom } = req.body;
    
    if (!name || !classroom) {
      return res.status(400).json({ error: '이름과 교실 번호는 필수입니다.' });
    }
    
    const classroomNum = parseInt(classroom);
    if (classroomNum < 1 || classroomNum > 5) {
      return res.status(400).json({ error: '교실 번호는 1-5 사이여야 합니다.' });
    }
    
    const result = await dbRun(
      'INSERT INTO students (name, classroom) VALUES (?, ?)',
      [name, classroomNum]
    );
    
    const student = await dbQuery('SELECT * FROM students WHERE id = ?', [result.id]);
    res.status(201).json(student[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 학생 삭제
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await dbRun('DELETE FROM students WHERE id = ?', [id]);
    res.json({ message: '학생이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

