<script setup>
import { onMounted, ref } from 'vue';
import http from '../../api/http';

const list = ref([]);
async function fetchAll() {
  const { data } = await http.get('/docgia');
  list.value = data;
}
onMounted(fetchAll);
async function toggleActive(dg) {
  await http.patch(`/docgia/${dg._id}/active`, { active: !dg.active });
  fetchAll();
}
</script>

<template>
  <div class="bg-white p-4 rounded shadow">
    <h3 class="font-semibold mb-3">Danh sách độc giả</h3>
    <table class="w-full text-sm">
      <thead><tr class="text-left border-b"><th>Họ tên</th><th>Điện thoại</th><th>Trạng thái</th><th></th></tr></thead>
      <tbody>
        <tr v-for="dg in list" :key="dg._id" class="border-b">
          <td>{{ dg.hoTen }}</td>
          <td>{{ dg.dienThoai }}</td>
          <td>{{ dg.active ? 'Hoạt động' : 'Ẩn' }}</td>
          <td class="text-right"><button @click="toggleActive(dg)" class="text-red-500">{{ dg.active ? 'Ẩn' : 'Hiện' }}</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>