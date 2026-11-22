import { api } from './client';

export const tutorAPI = {
  list: (params) => api.get('/tutors', { params }),
  getById: (id) => api.get(`/tutors/${id}`),
  getMyProfile: () => api.get('/tutors/me'),
  updateMyProfile: (payload) => api.put('/tutors/me', payload),
};
