<script setup>
import { onMounted, ref } from 'vue';
import { useSachStore } from '../stores/sach.store';

const sachStore = useSachStore();
const query = ref('');

onMounted(() => sachStore.fetchAll());

function onSearch() {
  query.value.trim() ? sachStore.search(query.value) : sachStore.fetchAll();
}
</script>

<template>
  <div>
    <div class="flex gap-2 mb-6">
      <input v-model="query" @keyup.enter="onSearch" placeholder="Tìm theo tên sách, tác giả, NXB..."
        class="border rounded px-3 py-2 flex-1" />
      <button @click="onSearch" class="bg-blue-600 text-white px-4 py-2 rounded">Tìm</button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="sach in sachStore.danhSachSach.filter(s => s.active)" :key="sach._id"
        class="border rounded p-4 bg-white shadow-sm">
        <h3 class="font-semibold">{{ sach.tenSach }}</h3>
        <p class="text-sm text-gray-500">Tác giả: {{ sach.tacGia || 'Không rõ' }}</p>
        <p class="text-sm text-gray-500">NXB: {{ sach.maNXB?.tenNhaXuatBan || '—' }}</p>
        <p class="text-sm mt-2" :class="sach.soQuyen > 0 ? 'text-green-600' : 'text-red-500'">
          {{ sach.soQuyen > 0 ? `Còn ${sach.soQuyen} quyển` : 'Hết sách' }}
        </p>
      </div>
    </div>
  </div>
</template>