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
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div class="flex gap-4 text-sm">
        <RouterLink to="/" class="font-semibold text-gray-800">Trang chủ</RouterLink>
        <RouterLink to="/muon-sach" class="text-gray-600">Mượn sách</RouterLink>
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
        <RouterLink v-else to="/login" class="text-blue-500">Đăng nhập</RouterLink>
      </div>
    </nav>
    <main class="p-6"><RouterView /></main>
  </div>
</template>