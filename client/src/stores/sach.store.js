import { defineStore } from 'pinia';
import http from '../api/http';

export const useSachStore = defineStore('sach', { // source of truth cho websocket
  state: () => ({ danhSachSach: [], socketInited: false }),
  actions: {
    async fetchAll(all = false) {
      const { data } = await http.get('/sach', { params: all ? { all: true } : {} });
      this.danhSachSach = data;
    },
    async search(query) {
      const { data } = await http.get('/sach/search', { params: { q: query } });
      this.danhSachSach = data;
    },
    initSocket(socket) {
      if (this.socketInited) return;
      this.socketInited = true;
      socket.on('book:updated', ({ id, soQuyen, active }) => {
        const b = this.danhSachSach.find((s) => s._id === id);
        if (b) { b.soQuyen = soQuyen; b.active = active; }
      });
    }
  }
});