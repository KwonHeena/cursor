import { useState, useEffect } from 'react';
import { studentAPI } from '../api';
import './StudentManagement.css';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    classroom: '1',
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('학생 목록 로드 실패:', error);
      alert('학생 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('학생 이름을 입력해주세요.');
      return;
    }

    try {
      await studentAPI.create(formData);
      setFormData({ name: '', classroom: '1' });
      loadStudents();
      alert('학생이 추가되었습니다.');
    } catch (error) {
      console.error('학생 추가 실패:', error);
      alert('학생 추가에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await studentAPI.delete(id);
      loadStudents();
      alert('학생이 삭제되었습니다.');
    } catch (error) {
      console.error('학생 삭제 실패:', error);
      alert('학생 삭제에 실패했습니다.');
    }
  };

  const studentsByClassroom = {};
  students.forEach(student => {
    if (!studentsByClassroom[student.classroom]) {
      studentsByClassroom[student.classroom] = [];
    }
    studentsByClassroom[student.classroom].push(student);
  });

  return (
    <div className="student-management">
      <h2>학생 관리</h2>
      
      <div className="student-form">
        <h3>새 학생 추가</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이름:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="학생 이름"
              required
            />
          </div>
          <div className="form-group">
            <label>교실:</label>
            <select
              value={formData.classroom}
              onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
            >
              <option value="1">1호실</option>
              <option value="2">2호실</option>
              <option value="3">3호실</option>
              <option value="4">4호실</option>
              <option value="5">5호실</option>
            </select>
          </div>
          <button type="submit">학생 추가</button>
        </form>
      </div>

      <div className="student-list">
        <h3>학생 목록</h3>
        {loading ? (
          <p>로딩 중...</p>
        ) : students.length === 0 ? (
          <p>등록된 학생이 없습니다.</p>
        ) : (
          <div className="classroom-groups">
            {[1, 2, 3, 4, 5].map(classroom => (
              <div key={classroom} className="classroom-group">
                <h4>{classroom}호실 ({studentsByClassroom[classroom]?.length || 0}명)</h4>
                {studentsByClassroom[classroom] ? (
                  <ul>
                    {studentsByClassroom[classroom].map(student => (
                      <li key={student.id}>
                        <span>{student.name}</span>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="delete-btn"
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>학생이 없습니다.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentManagement;

