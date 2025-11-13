import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://seeusoon.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const studentsAPI = {
  getAll: () => api.get('/api/students'),
  getById: (id: number) => api.get(`/api/students/${id}`),
  create: (data: any) => api.post('/api/students', data),
  update: (id: number, data: any) => api.put(`/api/students/${id}`, data),
  login: (email: string, password: string) => api.post('/api/students/login', { email, password }),
};

export const matchesAPI = {
  like: (likerId: number, likedId: number) => api.post('/api/matches/like', { liker_id: likerId, liked_id: likedId }),
  getMatches: (studentId: number) => api.get(`/api/matches/${studentId}`),
};

export const messagesAPI = {
  getMessages: (matchId: number) => api.get(`/api/messages/${matchId}`),
  sendMessage: (data: any) => api.post('/api/messages', data),
};

export const scheduleAPI = {
  getAvailability: (studentId: number) => api.get(`/api/schedule/${studentId}`),
  setAvailability: (studentId: number, dayOfWeek: number, startTime: string, endTime: string) =>
    api.post('/api/schedule', { student_id: studentId, day_of_week: dayOfWeek, start_time: startTime, end_time: endTime }),
  getMeetups: (studentId: number) => api.get(`/api/schedule/meetups/${studentId}`),
  createMeetup: (data: any) => api.post('/api/schedule/meetups', data),
  updateMeetupStatus: (meetupId: number, status: string) => api.put(`/api/schedule/meetups/${meetupId}`, { status }),
};

export default api;
