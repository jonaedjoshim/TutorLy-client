import { api } from './client';

export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  pendingPosts: (params) => api.get('/admin/posts/pending', { params }),
  reviewPost: (id, status) => api.put(`/admin/posts/${id}`, { status }),
  tutors: (params) => api.get('/admin/tutors', { params }),
  setTutorVerification: (id, verified) => api.put(`/admin/tutors/${id}/verify`, { verified }),
  users: (params) => api.get('/admin/users', { params }),
  setUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
};
