import { useState, useEffect } from 'react';
import { statisticsAPI } from '../api';
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
  const [selectedClassroom, setSelectedClassroom] = useState('1');
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, [selectedClassroom]);

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
        text: `${selectedClassroom}호실 출결 통계`,
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
      
      <div className="dashboard-controls">
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

      {loading ? (
        <p>로딩 중...</p>
      ) : statistics ? (
        <div className="dashboard-content">
          <div className="statistics-summary">
            <h3>{selectedClassroom}호실 통계 요약</h3>
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

