<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const maNhanVien = ref('');
const password = ref('');
const error = ref('');

async function submit() {
  error.value = '';
  try {
    await auth.login(maNhanVien.value, password.value);
    router.push('/admin/sach');
  } catch (e) {
    error.value = e.response?.data?.message || 'Đăng nhập thất bại';
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-lg font-semibold mb-4">Đăng nhập Nhân Viên</h2>
    <div v-if="error" class="bg-red-100 text-red-700 p-2 rounded mb-3">{{ error }}</div>
    <form @submit.prevent="submit" class="space-y-3">
      <input v-model="maNhanVien" placeholder="Mã nhân viên" required class="border rounded px-3 py-2 w-full" />
      <input v-model="password" type="password" placeholder="Mật khẩu" required class="border rounded px-3 py-2 w-full" />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded w-full">Đăng nhập</button>
    </form>
  </div>
</template>