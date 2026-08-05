<script setup>
import { onMounted, ref } from 'vue';
import { useSachStore } from '../stores/sach.store';
import SachDetailModal from '../components/SachDetailModal.vue';

const sachStore = useSachStore();
const query = ref('');
const selectedSach = ref(null);
const loading = ref(true);

onMounted(async () => {
  await sachStore.fetchAll();
  loading.value = false;
});

async function onSearch() {
  loading.value = true;
  query.value.trim() ? await sachStore.search(query.value) : await sachStore.fetchAll();
  loading.value = false;
}
</script>

<template>
  <div>
    <div class="flex gap-2 mb-8">
      <input v-model="query" @keyup.enter="onSearch" placeholder="Tìm theo tên sách, tác giả, NXB..."
        class="border border-gray-300 rounded-lg px-4 py-2.5 flex-1 bg-white" />
      <button @click="onSearch" class="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium">Tìm</button>
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      <div v-for="i in 6" :key="i" class="rounded-xl border border-gray-200 bg-white p-5 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div class="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
        <div class="h-3 bg-gray-100 rounded w-2/3 mb-4"></div>
        <div class="h-3 bg-gray-100 rounded w-1/3"></div>
      </div>
    </div>

    <div v-else-if="sachStore.danhSachSach.filter(s => s.active).length === 0"
      class="text-center py-16 text-gray-400">
      <p class="text-base">Không tìm thấy sách phù hợp.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      <div v-for="sach in sachStore.danhSachSach.filter(s => s.active)" :key="sach._id"
        @click="selectedSach = sach"
        class="group rounded-xl border border-gray-200 p-5 bg-white shadow-sm cursor-pointer transition hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-300">
        <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{{ sach.tenSach }}</h3>
        <p class="text-sm text-gray-500 mt-1">Tác giả: {{ sach.tacGia || 'Không rõ' }}</p>
        <p class="text-sm text-gray-500">NXB: {{ sach.maNXB?.tenNhaXuatBan || '—' }}</p>
        <p v-if="sach.moTa" class="text-sm text-gray-400 mt-2 line-clamp-2">{{ sach.moTa }}</p>
        <span class="inline-block text-xs font-medium mt-3 px-2.5 py-1 rounded-full"
          :class="sach.soQuyen > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'">
          {{ sach.soQuyen > 0 ? `Còn ${sach.soQuyen} quyển` : 'Hết sách' }}
        </span>
      </div>
    </div>

    <SachDetailModal v-if="selectedSach" :sach="selectedSach" @close="selectedSach = null" />
  </div>
</template>
