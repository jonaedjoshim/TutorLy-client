import { api } from './client';

export const tutorAPI = {
  list: (params) => api.get('/tutors', { params }),
  getById: (id) => api.get(`/tutors/${id}`),
  getMyProfile: () => api.get('/tutors/me'),
  updateMyProfile: (payload) => api.put('/tutors/me', payload),

  uploadDocuments: (formData) =>
    api.post('/tutors/me/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  removeDocument: (filename) =>
    api.delete(`/tutors/me/documents/${encodeURIComponent(filename)}`),

  downloadDocument: async (filename) => {
    const response = await api.get(
      `/tutors/me/documents/${encodeURIComponent(filename)}`,
      { responseType: 'blob' }
    );

    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
