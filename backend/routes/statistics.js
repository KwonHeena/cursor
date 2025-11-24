const express = require('express');
const router = express.Router();
const { dbQuery } = require('../db');

// 교실별 출결 통계 조회
router.get('/classroom/:classroom', async (req, res) => {
  try {
    const classroom = parseInt(req.params.classroom);
    if (classroom < 1 || classroom > 5) {
      return res.status(400).json({ error: '교실 번호는 1-5 사이여야 합니다.' });
    }
    
    // 교실별 출결 상태별 통계
    const stats = await dbQuery(`
      SELECT 
        a.status,
        COUNT(*) as count
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE s.classroom = ?
      GROUP BY a.status
    `, [classroom]);
    
    // 기본값 설정 (데이터가 없을 경우)
    const statusCounts = {
      '출석': 0,
      '결석': 0,
      '지각': 0,
      '조퇴': 0
    };
    
    stats.forEach(stat => {
      statusCounts[stat.status] = stat.count;
    });
    
    res.json({
      classroom,
      statistics: statusCounts,
      total: Object.values(statusCounts).reduce((a, b) => a + b, 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 모든 교실 통계 조회
router.get('/all', async (req, res) => {
  try {
    const allStats = [];
    
    for (let classroom = 1; classroom <= 5; classroom++) {
      const stats = await dbQuery(`
        SELECT 
          a.status,
          COUNT(*) as count
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE s.classroom = ?
        GROUP BY a.status
      `, [classroom]);
      
      const statusCounts = {
        '출석': 0,
        '결석': 0,
        '지각': 0,
        '조퇴': 0
      };
      
      stats.forEach(stat => {
        statusCounts[stat.status] = stat.count;
      });
      
      allStats.push({
        classroom,
        statistics: statusCounts,
        total: Object.values(statusCounts).reduce((a, b) => a + b, 0)
      });
    }
    
    res.json(allStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

