import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Students API
export const studentsAPI = {
  getAll: () => api.get('/students'),
  getById: (id: number) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  login: (data: { email: string; password: string }) => api.post('/students/login', data),
  update: (id: number, data: any) => api.put(`/students/${id}`, data),
};

// Matches API
export const matchesAPI = {
  like: (liker_id: number, liked_id: number) => 
    api.post('/matches/like', { liker_id, liked_id }),
  pass: (student_id: number) => 
    api.post('/matches/pass', { student_id }),
  getMatches: (student_id: number) => 
    api.get(`/matches/${student_id}`),
};

// Messages API
export const messagesAPI = {
  send: (sender_id: number, receiver_id: number, message: string) =>
    api.post('/messages', { sender_id, receiver_id, message }),
  getConversation: (user_id: number, other_user_id: number) =>
    api.get(`/messages/${user_id}/${other_user_id}`),
  getConversations: (user_id: number) =>
    api.get(`/messages/conversations/${user_id}`),
  markAsRead: (user_id: number, other_user_id: number) =>
    api.put(`/messages/read/${user_id}/${other_user_id}`),
};

// Schedule API
export const scheduleAPI = {
  setAvailability: (student_id: number, day_of_week: number, start_time: string, end_time: string) =>
    api.post('/schedule/availability', { student_id, day_of_week, start_time, end_time }),
  getAvailability: (student_id: number) =>
    api.get(`/schedule/availability/${student_id}`),
  deleteAvailability: (id: number) =>
    api.delete(`/schedule/availability/${id}`),
  getMutualAvailability: (student1_id: number, student2_id: number) =>
    api.get(`/schedule/mutual/${student1_id}/${student2_id}`),
  createMeetup: (data: any) =>
    api.post('/schedule/meetups', data),
  getMeetups: (student_id: number) =>
    api.get(`/schedule/meetups/${student_id}`),
  updateMeetupStatus: (id: number, status: string) =>
    api.put(`/schedule/meetups/${id}`, { status }),
};

export default api;
