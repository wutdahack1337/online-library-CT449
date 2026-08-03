<script setup>
import { onMounted, ref, computed } from 'vue';
import http from '../../api/http';

const list = ref([]);
const onlyBorrowing = ref(true);

async function fetchAll() {
  const { data } = await http.get('/muon-sach');
  list.value = data;
}
onMounted(fetchAll);

const filtered = computed(() => onlyBorrowing.value ? list.value.filter(r => !r.ngayTra) : list.value);

async function traSach(id) {
  await http.patch(`/muon-sach/${id}/tra`);
  fetchAll();
}
</script>

<template>
  <div class="bg-white p-4 rounded shadow">
    <div class="flex justify-between items-center mb-3">
      <h3 class="font-semibold">Theo dõi mượn/trả</h3>
      <label class="text-sm flex items-center gap-2"><input type="checkbox" v-model="onlyBorrowing" /> Chỉ hiện đang mượn</label>
    </div>
    <table class="w-full text-sm">
      <thead><tr class="text-left border-b"><th>Độc giả</th><th>Sách</th><th>Ngày mượn</th><th>Ngày trả</th><th></th></tr></thead>
      <tbody>
        <tr v-for="r in filtered" :key="r._id" class="border-b">
          <td>{{ r.maDocGia?.hoTen }} ({{ r.maDocGia?.dienThoai }})</td>
          <td>{{ r.maSach?.tenSach }}</td>
          <td>{{ new Date(r.ngayMuon).toLocaleDateString('vi-VN') }}</td>
          <td>{{ r.ngayTra ? new Date(r.ngayTra).toLocaleDateString('vi-VN') : '—' }}</td>
          <td class="text-right"><button v-if="!r.ngayTra" @click="traSach(r._id)" class="text-blue-600">Trả sách</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>