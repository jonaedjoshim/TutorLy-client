import { api } from './client';

export const postAPI = {
  list: (params) => api.get('/posts', { params }),
  mine: (params) => api.get('/posts/mine', { params }),
  getById: (id) => api.get(`/posts/${id}`),
  create: (payload) => api.post('/posts', payload),
  update: (id, payload) => api.put(`/posts/${id}`, payload),
  remove: (id) => api.delete(`/posts/${id}`),
};
