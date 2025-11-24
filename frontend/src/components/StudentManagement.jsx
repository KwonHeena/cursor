import { useState, useEffect } from 'react';
import { studentAPI } from '../api';
import './StudentManagement.css';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterClassroom, setFilterClassroom] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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

  // 필터링된 학생 목록
  const filteredStudents = students.filter(student => {
    const matchClassroom = filterClassroom === 'all' || student.classroom === parseInt(filterClassroom);
    const matchSearch = searchTerm === '' || student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClassroom && matchSearch;
  });

  // 교실별 통계
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
        <div className="student-list-header">
          <h3>학생 목록</h3>
          <div className="list-filters">
            <div className="filter-group">
              <label>교실 필터:</label>
              <select
                value={filterClassroom}
                onChange={(e) => setFilterClassroom(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="1">1호실</option>
                <option value="2">2호실</option>
                <option value="3">3호실</option>
                <option value="4">4호실</option>
                <option value="5">5호실</option>
              </select>
            </div>
            <div className="filter-group">
              <label>검색:</label>
              <input
                type="text"
                placeholder="학생 이름 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <p className="loading-text">로딩 중...</p>
        ) : students.length === 0 ? (
          <p className="empty-text">등록된 학생이 없습니다.</p>
        ) : (
          <div className="student-table-container">
            <table className="student-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>이름</th>
                  <th>교실</th>
                  <th>등록일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td className="student-name">{student.name}</td>
                      <td>
                        <span className="classroom-badge">{student.classroom}호실</span>
                      </td>
                      <td className="date-cell">
                        {new Date(student.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="delete-btn"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="table-footer">
              <span className="total-count">
                전체 {students.length}명 | 표시 {filteredStudents.length}명
              </span>
              <div className="classroom-summary">
                {[1, 2, 3, 4, 5].map(classroom => (
                  <span key={classroom} className="summary-badge">
                    {classroom}호실: {studentsByClassroom[classroom]?.length || 0}명
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentManagement;

