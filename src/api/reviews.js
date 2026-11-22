import { api } from './client';

export const reviewAPI = {
  list: (tutorId) => api.get('/reviews', { params: { tutorId } }),
  create: (payload) => api.post('/reviews', payload),
};
