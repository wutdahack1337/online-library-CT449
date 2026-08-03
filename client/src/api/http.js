import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

const http = axios.create({ baseURL: '/api' });

http.interceptors.request.use((config) => { // tranh trung lap headers: { Authorization: ... }
  const auth = useAuthStore();
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`; 
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) useAuthStore().logout(); // logout khi token het han
    return Promise.reject(err);
  }
);

export default http;