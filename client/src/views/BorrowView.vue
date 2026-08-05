<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import http from '../api/http';
import { useSachStore } from '../stores/sach.store';

const sachStore = useSachStore();
const route = useRoute();
const form = ref({ hoTen: '', ngaySinh: '', phai: '', diaChi: '', dienThoai: '' });
const maSach = ref(typeof route.query.maSach === 'string' ? route.query.maSach : '');
const message = ref('');
const error = ref('');

onMounted(() => sachStore.fetchAll());

async function submit() {
  message.value = ''; error.value = '';
  try {
    await http.post('/muon-sach', { docgiaInfo: form.value, maSach: maSach.value });
    message.value = 'Đăng ký mượn sách thành công!';
    form.value = { hoTen: '', ngaySinh: '', phai: '', diaChi: '', dienThoai: '' };
    maSach.value = '';
  } catch (e) {
    error.value = e.response?.data?.message || 'Có lỗi xảy ra';
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <h2 class="text-xl font-bold text-gray-900 mb-5">Đăng ký mượn sách</h2>
    <div v-if="message" class="bg-green-50 text-green-700 text-sm px-3 py-2.5 rounded-lg mb-4">{{ message }}</div>
    <div v-if="error" class="bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-lg mb-4">{{ error }}</div>
    <form @submit.prevent="submit" class="space-y-3">
      <input v-model="form.hoTen" placeholder="Họ tên" required class="border border-gray-300 rounded-lg px-3.5 py-2.5 w-full" />
      <input v-model="form.ngaySinh" type="date" class="border border-gray-300 rounded-lg px-3.5 py-2.5 w-full" />
      <select v-model="form.phai" class="border border-gray-300 rounded-lg px-3.5 py-2.5 w-full">
        <option value="">-- Giới tính --</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
      </select>
      <input v-model="form.diaChi" placeholder="Địa chỉ" class="border border-gray-300 rounded-lg px-3.5 py-2.5 w-full" />
      <input v-model="form.dienThoai" placeholder="Số điện thoại" required class="border border-gray-300 rounded-lg px-3.5 py-2.5 w-full" />
      <select v-model="maSach" required class="border border-gray-300 rounded-lg px-3.5 py-2.5 w-full">
        <option value="" disabled>-- Chọn sách --</option>
        <option v-for="s in sachStore.danhSachSach.filter(s => s.active && s.soQuyen > 0)" :key="s._id" :value="s._id">
          {{ s.tenSach }} (còn {{ s.soQuyen }})
        </option>
      </select>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium w-full mt-2">Đăng ký mượn</button>
    </form>
  </div>
</template>