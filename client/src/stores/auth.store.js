import { defineStore } from 'pinia';
import http from '../api/http';
import router from '../router';

export const useAuthStore = defineStore('auth', { // tao 1 kho state duy nhat, cho tat ca component truy cap
  state: () => ({
    token: localStorage.getItem('token') || null,
    hoTen: localStorage.getItem('hoTen') || null
  }),
  actions: {
    async login(maNhanVien, password) {
      const { data } = await http.post('/auth/login', { maNhanVien, password });
      this.token = data.token;
      this.hoTen = data.hoTen;
      localStorage.setItem('token', data.token);
      localStorage.setItem('hoTen', data.hoTen);
    },
    logout() {
      this.token = null;
      this.hoTen = null;
      localStorage.clear();
      router.push('/login');
    }
  }
});