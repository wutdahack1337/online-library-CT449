<script setup>
import { onMounted, ref } from 'vue';
import http from '../../api/http';

const list = ref([]);
const form = ref({ maNhaXuatBan: '', tenNhaXuatBan: '', diaChi: '' });
const editingId = ref(null);

async function fetchAll() {
  const { data } = await http.get('/nhaxuatban', { params: { all: true } });
  list.value = data;
}
onMounted(fetchAll);
async function submit() {
  if (editingId.value) await http.put(`/nhaxuatban/${editingId.value}`, form.value);
  else await http.post('/nhaxuatban', form.value);
  resetForm(); fetchAll();
}
function edit(n) {
  editingId.value = n._id;
  form.value = { maNhaXuatBan: n.maNhaXuatBan, tenNhaXuatBan: n.tenNhaXuatBan, diaChi: n.diaChi };
}
function resetForm() {
  editingId.value = null;
  form.value = { maNhaXuatBan: '', tenNhaXuatBan: '', diaChi: '' };
}
async function toggleActive(n) {
  await http.patch(`/nhaxuatban/${n._id}/active`, { active: !n.active });
  fetchAll();
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white p-4 rounded shadow">
      <h3 class="font-semibold mb-3">{{ editingId ? 'Sửa NXB' : 'Thêm NXB' }}</h3>
      <form @submit.prevent="submit" class="space-y-2">
        <input v-model="form.maNhaXuatBan" placeholder="Mã NXB" required class="border rounded px-3 py-2 w-full" />
        <input v-model="form.tenNhaXuatBan" placeholder="Tên NXB" required class="border rounded px-3 py-2 w-full" />
        <input v-model="form.diaChi" placeholder="Địa chỉ" class="border rounded px-3 py-2 w-full" />
        <div class="flex gap-2">
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded flex-1">{{ editingId ? 'Cập nhật' : 'Thêm' }}</button>
          <button v-if="editingId" type="button" @click="resetForm" class="bg-gray-300 px-4 py-2 rounded">Hủy</button>
        </div>
      </form>
    </div>
    <div class="bg-white p-4 rounded shadow">
      <h3 class="font-semibold mb-3">Danh sách NXB</h3>
      <table class="w-full text-sm">
        <thead><tr class="text-left border-b"><th>Tên</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>
          <tr v-for="n in list" :key="n._id" class="border-b">
            <td>{{ n.tenNhaXuatBan }}</td>
            <td>{{ n.active ? 'Hiện' : 'Ẩn' }}</td>
            <td class="text-right space-x-2">
              <button @click="edit(n)" class="text-blue-600">Sửa</button>
              <button @click="toggleActive(n)" class="text-red-500">{{ n.active ? 'Ẩn' : 'Hiện' }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>