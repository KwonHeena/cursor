import { useState, useEffect } from 'react';
import { studentAPI, attendanceAPI } from '../api';
import './AttendanceManagement.css';

function AttendanceManagement() {
  const [students, setStudents] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [selectedClassroom]);

  useEffect(() => {
    if (students.length > 0) {
      loadAttendanceRecords();
    }
  }, [students, selectedDate]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getByClassroom(selectedClassroom);
      setStudents(response.data);
    } catch (error) {
      console.error('학생 목록 로드 실패:', error);
      alert('학생 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceRecords = async () => {
    try {
      const response = await attendanceAPI.getByDate(selectedDate);
      const records = {};
      response.data.forEach(record => {
        records[record.student_id] = record.status;
      });
      setAttendanceRecords(records);
    } catch (error) {
      console.error('출결 기록 로드 실패:', error);
    }
  };

  const handleAttendanceChange = async (studentId, status) => {
    try {
      await attendanceAPI.create({
        student_id: studentId,
        date: selectedDate,
        status: status,
      });
      setAttendanceRecords({
        ...attendanceRecords,
        [studentId]: status,
      });
    } catch (error) {
      console.error('출결 기록 저장 실패:', error);
      alert('출결 기록 저장에 실패했습니다.');
    }
  };

  return (
    <div className="attendance-management">
      <h2>출결 관리</h2>
      
      <div className="attendance-controls">
        <div className="control-group">
          <label>교실 선택:</label>
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
          >
            <option value="1">1호실</option>
            <option value="2">2호실</option>
            <option value="3">3호실</option>
            <option value="4">4호실</option>
            <option value="5">5호실</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>날짜 선택:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="attendance-list">
        {loading ? (
          <p>로딩 중...</p>
        ) : students.length === 0 ? (
          <p>이 교실에 등록된 학생이 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>출석</th>
                <th>결석</th>
                <th>지각</th>
                <th>조퇴</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>
                    <button
                      className={`status-btn ${attendanceRecords[student.id] === '출석' ? 'active' : ''}`}
                      onClick={() => handleAttendanceChange(student.id, '출석')}
                    >
                      출석
                    </button>
                  </td>
                  <td>
                    <button
                      className={`status-btn ${attendanceRecords[student.id] === '결석' ? 'active' : ''}`}
                      onClick={() => handleAttendanceChange(student.id, '결석')}
                    >
                      결석
                    </button>
                  </td>
                  <td>
                    <button
                      className={`status-btn ${attendanceRecords[student.id] === '지각' ? 'active' : ''}`}
                      onClick={() => handleAttendanceChange(student.id, '지각')}
                    >
                      지각
                    </button>
                  </td>
                  <td>
                    <button
                      className={`status-btn ${attendanceRecords[student.id] === '조퇴' ? 'active' : ''}`}
                      onClick={() => handleAttendanceChange(student.id, '조퇴')}
                    >
                      조퇴
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AttendanceManagement;

