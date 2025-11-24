// Vercel 서버리스 환경용 인메모리 데이터베이스
// 주의: 서버 재시작 시 데이터가 사라집니다

let students = [];
let attendance = [];
let nextStudentId = 1;
let nextAttendanceId = 1;

// 데이터베이스 초기화
function initDatabase() {
  return new Promise((resolve) => {
    // 테이블은 이미 메모리에 있으므로 바로 완료
    console.log('인메모리 데이터베이스가 준비되었습니다.');
    resolve();
  });
}

// 쿼리 헬퍼 함수
const dbQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    try {
      // 간단한 SQL 파싱 (실제로는 더 복잡해야 하지만, 기본 기능만 구현)
      
      // SELECT * FROM students
      if (query.includes('SELECT * FROM students')) {
        if (query.includes('WHERE classroom = ?')) {
          const classroom = params[0];
          const result = students.filter(s => s.classroom === classroom);
          resolve(result);
        } else if (query.includes('WHERE id = ?')) {
          const id = params[0];
          const result = students.filter(s => s.id === id);
          resolve(result);
        } else {
          resolve([...students]);
        }
      }
      // SELECT a.*, s.name, s.classroom FROM attendance a JOIN students s
      else if (query.includes('FROM attendance a') && query.includes('JOIN students s')) {
        if (query.includes('WHERE a.date = ?')) {
          const date = params[0];
          const result = attendance
            .filter(a => a.date === date)
            .map(a => {
              const student = students.find(s => s.id === a.student_id);
              return {
                ...a,
                name: student?.name || '',
                classroom: student?.classroom || 0
              };
            });
          resolve(result);
        } else {
          resolve(attendance.map(a => {
            const student = students.find(s => s.id === a.student_id);
            return {
              ...a,
              name: student?.name || '',
              classroom: student?.classroom || 0
            };
          }));
        }
      }
      // SELECT * FROM attendance WHERE student_id = ?
      else if (query.includes('FROM attendance') && query.includes('WHERE student_id = ?')) {
        const studentId = params[0];
        const result = attendance.filter(a => a.student_id === studentId);
        resolve(result);
      }
      // 통계 쿼리
      else if (query.includes('COUNT(*)') && query.includes('GROUP BY')) {
        const classroom = params[0];
        const classroomStudents = students.filter(s => s.classroom === classroom);
        const studentIds = classroomStudents.map(s => s.id);
        const classroomAttendance = attendance.filter(a => studentIds.includes(a.student_id));
        
        const stats = {
          '출석': 0,
          '결석': 0,
          '지각': 0,
          '조퇴': 0
        };
        
        classroomAttendance.forEach(a => {
          if (stats[a.status] !== undefined) {
            stats[a.status]++;
          }
        });
        
        resolve(Object.entries(stats).map(([status, count]) => ({ status, count })));
      }
      // 학생 통계
      else if (query.includes('FROM attendance') && query.includes('GROUP BY status')) {
        const studentId = params[0];
        const studentAttendance = attendance.filter(a => a.student_id === studentId);
        
        const stats = {
          '출석': 0,
          '결석': 0,
          '지각': 0,
          '조퇴': 0
        };
        
        studentAttendance.forEach(a => {
          if (stats[a.status] !== undefined) {
            stats[a.status]++;
          }
        });
        
        resolve(Object.entries(stats).map(([status, count]) => ({ status, count })));
      }
      // COUNT(*) FROM attendance WHERE student_id = ?
      else if (query.includes('COUNT(*)') && query.includes('WHERE student_id = ?')) {
        const studentId = params[0];
        const count = attendance.filter(a => a.student_id === studentId).length;
        resolve([{ total: count }]);
      }
      else {
        resolve([]);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    try {
      // INSERT INTO students
      if (query.includes('INSERT INTO students')) {
        const name = params[0];
        const classroom = params[1];
        const student = {
          id: nextStudentId++,
          name,
          classroom,
          created_at: new Date().toISOString()
        };
        students.push(student);
        resolve({ id: student.id, changes: 1 });
      }
      // INSERT INTO attendance
      else if (query.includes('INSERT INTO attendance')) {
        const studentId = params[0];
        const date = params[1];
        const status = params[2];
        
        // 기존 기록 확인
        const existing = attendance.findIndex(
          a => a.student_id === studentId && a.date === date
        );
        
        if (existing >= 0) {
          attendance[existing].status = status;
          resolve({ id: attendance[existing].id, changes: 1 });
        } else {
          const record = {
            id: nextAttendanceId++,
            student_id: studentId,
            date,
            status,
            created_at: new Date().toISOString()
          };
          attendance.push(record);
          resolve({ id: record.id, changes: 1 });
        }
      }
      // UPDATE attendance
      else if (query.includes('UPDATE attendance')) {
        const status = params[0];
        const studentId = params[1];
        const date = params[2];
        
        const index = attendance.findIndex(
          a => a.student_id === studentId && a.date === date
        );
        
        if (index >= 0) {
          attendance[index].status = status;
          resolve({ id: attendance[index].id, changes: 1 });
        } else {
          resolve({ id: 0, changes: 0 });
        }
      }
      // DELETE FROM students
      else if (query.includes('DELETE FROM students')) {
        const id = params[0];
        const index = students.findIndex(s => s.id === id);
        if (index >= 0) {
          students.splice(index, 1);
          // 관련 출결 기록도 삭제
          attendance = attendance.filter(a => a.student_id !== id);
          resolve({ id, changes: 1 });
        } else {
          resolve({ id, changes: 0 });
        }
      }
      // DELETE FROM attendance
      else if (query.includes('DELETE FROM attendance')) {
        attendance = [];
        resolve({ id: 0, changes: attendance.length });
      }
      else {
        resolve({ id: 0, changes: 0 });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { initDatabase, dbQuery, dbRun };

