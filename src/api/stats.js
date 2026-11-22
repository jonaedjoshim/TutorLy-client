import { api } from './client';

export const statsAPI = {
  get: () => api.get('/stats'),
};
