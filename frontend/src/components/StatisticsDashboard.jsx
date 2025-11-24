import { useState, useEffect } from 'react';
import { statisticsAPI, studentAPI } from '../api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './StatisticsDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StatisticsDashboard() {
  const [viewMode, setViewMode] = useState('classroom'); // 'classroom' or 'student'
  const [selectedClassroom, setSelectedClassroom] = useState('1');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (viewMode === 'classroom') {
      loadStatistics();
    } else {
      loadStudents();
    }
  }, [selectedClassroom, viewMode]);

  useEffect(() => {
    if (viewMode === 'student' && selectedStudent) {
      loadStudentStatistics();
    }
  }, [selectedStudent, viewMode]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await statisticsAPI.getByClassroom(selectedClassroom);
      setStatistics(response.data);
    } catch (error) {
      console.error('통계 로드 실패:', error);
      alert('통계를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getByClassroom(selectedClassroom);
      setStudents(response.data);
      if (response.data.length > 0 && !selectedStudent) {
        setSelectedStudent(response.data[0].id.toString());
      }
    } catch (error) {
      console.error('학생 목록 로드 실패:', error);
      alert('학생 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentStatistics = async () => {
    if (!selectedStudent) return;
    try {
      setLoading(true);
      const response = await statisticsAPI.getByStudent(selectedStudent);
      setStatistics(response.data);
    } catch (error) {
      console.error('학생 통계 로드 실패:', error);
      alert('학생 통계를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = statistics ? {
    labels: ['출석', '결석', '지각', '조퇴'],
    datasets: [
      {
        label: '출결 현황',
        data: [
          statistics.statistics.출석,
          statistics.statistics.결석,
          statistics.statistics.지각,
          statistics.statistics.조퇴,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: viewMode === 'classroom' 
          ? `${selectedClassroom}호실 출결 통계`
          : statistics?.student 
            ? `${statistics.student.name} 학생 출결 통계`
            : '학생 출결 통계',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="statistics-dashboard">
      <h2>통계 대시보드</h2>
      
      <div className="dashboard-mode-selector">
        <button
          className={viewMode === 'classroom' ? 'active' : ''}
          onClick={() => setViewMode('classroom')}
        >
          교실별 통계
        </button>
        <button
          className={viewMode === 'student' ? 'active' : ''}
          onClick={() => setViewMode('student')}
        >
          학생별 통계
        </button>
      </div>

      <div className="dashboard-controls">
        <div className="control-group">
          <label>교실 선택:</label>
          <select
            value={selectedClassroom}
            onChange={(e) => {
              setSelectedClassroom(e.target.value);
              if (viewMode === 'student') {
                setSelectedStudent('');
              }
            }}
          >
            <option value="1">1호실</option>
            <option value="2">2호실</option>
            <option value="3">3호실</option>
            <option value="4">4호실</option>
            <option value="5">5호실</option>
          </select>
        </div>
        
        {viewMode === 'student' && (
          <div className="control-group">
            <label>학생 선택:</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={students.length === 0}
            >
              <option value="">학생을 선택하세요</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : statistics ? (
        <div className="dashboard-content">
          <div className="statistics-summary">
            <h3>
              {viewMode === 'classroom' 
                ? `${selectedClassroom}호실 통계 요약`
                : `${statistics.student?.name || ''} 학생 통계 요약`}
            </h3>
            {viewMode === 'student' && statistics.student && (
              <div className="student-info">
                <div className="info-item">
                  <span className="info-label">이름:</span>
                  <span className="info-value">{statistics.student.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">교실:</span>
                  <span className="info-value">{statistics.student.classroom}호실</span>
                </div>
                <div className="info-item">
                  <span className="info-label">총 출결 기록:</span>
                  <span className="info-value">{statistics.total}건</span>
                </div>
              </div>
            )}
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-label">출석</div>
                <div className="card-value">{statistics.statistics.출석}</div>
              </div>
              <div className="summary-card">
                <div className="card-label">결석</div>
                <div className="card-value">{statistics.statistics.결석}</div>
              </div>
              <div className="summary-card">
                <div className="card-label">지각</div>
                <div className="card-value">{statistics.statistics.지각}</div>
              </div>
              <div className="summary-card">
                <div className="card-label">조퇴</div>
                <div className="card-value">{statistics.statistics.조퇴}</div>
              </div>
              <div className="summary-card total">
                <div className="card-label">총계</div>
                <div className="card-value">{statistics.total}</div>
              </div>
            </div>
          </div>

          <div className="chart-container">
            {chartData && <Bar data={chartData} options={chartOptions} />}
          </div>
        </div>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
}

export default StatisticsDashboard;

