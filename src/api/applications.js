import { api } from './client';

export const applicationAPI = {
  apply: (payload) => api.post('/applications', payload),
  mine: (params) => api.get('/applications/mine', { params }),
  received: (params) => api.get('/applications/received', { params }),
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};
