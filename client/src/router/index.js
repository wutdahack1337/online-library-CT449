import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import HomeView from '../views/HomeView.vue';
import BorrowView from '../views/BorrowView.vue';
import LoginView from '../views/LoginView.vue';
import SachManage from '../views/admin/SachManage.vue';
import DocGiaManage from '../views/admin/DocGiaManage.vue';
import NhaXuatBanManage from '../views/admin/NhaXuatBanManage.vue';
import MuonSachManage from '../views/admin/MuonSachManage.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/muon-sach', component: BorrowView },
  { path: '/login', component: LoginView },
  { path: '/admin/sach', component: SachManage, meta: { requiresAuth: true } },
  { path: '/admin/docgia', component: DocGiaManage, meta: { requiresAuth: true } },
  { path: '/admin/nxb', component: NhaXuatBanManage, meta: { requiresAuth: true } },
  { path: '/admin/muon-sach', component: MuonSachManage, meta: { requiresAuth: true } }
];

const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.token) return '/login';
});

export default router;