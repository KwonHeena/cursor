import axios from 'axios';

// 환경 변수에서 API URL 가져오기 (없으면 기본값 사용)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 학생 관련 API
export const studentAPI = {
  getAll: () => api.get('/students'),
  getByClassroom: (classroom) => api.get(`/students/classroom/${classroom}`),
  create: (data) => api.post('/students', data),
  delete: (id) => api.delete(`/students/${id}`),
};

// 출결 관련 API
export const attendanceAPI = {
  create: (data) => api.post('/attendance', data),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
};

// 통계 관련 API
export const statisticsAPI = {
  getByClassroom: (classroom) => api.get(`/statistics/classroom/${classroom}`),
  getByStudent: (studentId) => api.get(`/statistics/student/${studentId}`),
  getAll: () => api.get('/statistics/all'),
};

export default api;

