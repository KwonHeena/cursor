const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const os = require('os');

// Vercel 서버리스 환경에서는 /tmp 디렉토리 사용 (쓰기 가능)
// 로컬 환경에서는 database 폴더 사용
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
const dbDir = isVercel ? '/tmp' : path.join(__dirname, '../database');
const dbPath = path.join(dbDir, 'attendance.db');

// 디렉토리가 없으면 생성 (로컬 환경)
if (!isVercel && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 데이터베이스 연결
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err.message);
  } else {
    console.log('SQLite 데이터베이스에 연결되었습니다.');
  }
});

// 데이터베이스 초기화
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 학생 테이블
      db.run(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          classroom INTEGER NOT NULL CHECK(classroom >= 1 AND classroom <= 5),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('학생 테이블 생성 오류:', err.message);
          reject(err);
        } else {
          console.log('학생 테이블이 준비되었습니다.');
        }
      });

      // 출결 기록 테이블
      db.run(`
        CREATE TABLE IF NOT EXISTS attendance (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('출석', '결석', '지각', '조퇴')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
          UNIQUE(student_id, date)
        )
      `, (err) => {
        if (err) {
          console.error('출결 테이블 생성 오류:', err.message);
          reject(err);
        } else {
          console.log('출결 테이블이 준비되었습니다.');
          resolve();
        }
      });
    });
  });
}

// 데이터베이스 쿼리 헬퍼 함수
const dbQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

module.exports = { db, initDatabase, dbQuery, dbRun };

