<script setup>
import { onMounted } from 'vue';
import { useSocket } from './composables/useSocket';
import { useSachStore } from './stores/sach.store';
import { useAuthStore } from './stores/auth.store';

const sachStore = useSachStore();
const auth = useAuthStore();

onMounted(() => sachStore.initSocket(useSocket()));
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <nav class="bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      <div class="flex gap-5 text-sm">
        <RouterLink to="/" class="font-semibold text-gray-800">Trang chủ</RouterLink>
        <RouterLink to="/muon-sach" class="text-gray-600">Mượn sách</RouterLink>
        <RouterLink to="/gioi-thieu" class="text-gray-600">Giới thiệu</RouterLink>
        <template v-if="auth.token">
          <RouterLink to="/admin/sach" class="text-gray-600">Quản lý sách</RouterLink>
          <RouterLink to="/admin/docgia" class="text-gray-600">Quản lý độc giả</RouterLink>
          <RouterLink to="/admin/nxb" class="text-gray-600">Quản lý NXB</RouterLink>
          <RouterLink to="/admin/muon-sach" class="text-gray-600">Trả sách</RouterLink>
        </template>
      </div>
      <div class="text-sm">
        <span v-if="auth.token" class="text-gray-500 mr-3">{{ auth.hoTen }}</span>
        <button v-if="auth.token" @click="auth.logout" class="text-red-500">Đăng xuất</button>
        <RouterLink v-else to="/login" class="text-blue-500 font-medium">Đăng nhập</RouterLink>
      </div>
    </nav>
    <main class="p-6 flex-1 max-w-6xl w-full mx-auto"><RouterView /></main>
    <footer class="bg-white border-t border-gray-100">
      <div class="max-w-5xl mx-auto px-6 py-6 text-sm text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
        <div>© 2026 Trần Quang Minh B2304069</div>
        <div class="flex flex-col sm:items-end gap-1">
          <span>Email: <a href="mailto:minhb2304069@gmail.com" class="text-blue-500">minhb2304069@gmail.com</a></span>
          <span>Điện thoại: <a href="tel:0949447516" class="text-blue-500">0949447516</a></span>
          <span>Giờ hoạt động: 00:00 - 23:59</span>
        </div>
      </div>
    </footer>
  </div>
</template>