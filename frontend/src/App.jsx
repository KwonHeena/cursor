import { useState } from 'react';
import './App.css';
import StudentManagement from './components/StudentManagement';
import AttendanceManagement from './components/AttendanceManagement';
import StatisticsDashboard from './components/StatisticsDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <div className="app">
      <header className="app-header">
        <h1>학원 출결관리 시스템</h1>
      </header>
      
      <nav className="app-nav">
        <button 
          className={activeTab === 'students' ? 'active' : ''}
          onClick={() => setActiveTab('students')}
        >
          학생 관리
        </button>
        <button 
          className={activeTab === 'attendance' ? 'active' : ''}
          onClick={() => setActiveTab('attendance')}
        >
          출결 관리
        </button>
        <button 
          className={activeTab === 'statistics' ? 'active' : ''}
          onClick={() => setActiveTab('statistics')}
        >
          통계 대시보드
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'students' && <StudentManagement />}
        {activeTab === 'attendance' && <AttendanceManagement />}
        {activeTab === 'statistics' && <StatisticsDashboard />}
      </main>
    </div>
  );
}

export default App;
