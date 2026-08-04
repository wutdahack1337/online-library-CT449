<script setup>
import { onMounted, ref } from 'vue';
import http from '../../api/http';

const list = ref([]);
const nxbs = ref([]);
const form = ref({ tenSach: '', donGia: '', soQuyen: '', namXuatBan: '', tacGia: '', maNXB: '' });
const editingId = ref(null);

async function fetchAll() {
  const { data } = await http.get('/sach', { params: { all: true } }); // xem cả sách đã ẩn để có thể "Hiện" lại
  list.value = data;
}
async function fetchNXB() {
  const { data } = await http.get('/nhaxuatban', { params: { all: true } });
  nxbs.value = data;
}
onMounted(() => { fetchAll(); fetchNXB(); });

async function submit() {
  if (editingId.value) await http.put(`/sach/${editingId.value}`, form.value);
  else await http.post('/sach', form.value);
  resetForm(); fetchAll();
}

function editSach(sach) {
  editingId.value = sach._id;
  form.value = {
    tenSach: sach.tenSach, donGia: sach.donGia,
    soQuyen: sach.soQuyen, namXuatBan: sach.namXuatBan, tacGia: sach.tacGia,
    maNXB: sach.maNXB?._id || sach.maNXB
  };
}
function resetForm() {
  editingId.value = null;
  form.value = { tenSach: '', donGia: '', soQuyen: '', namXuatBan: '', tacGia: '', maNXB: '' };
}
async function toggleActive(sach) {
  await http.patch(`/sach/${sach._id}/active`, { active: !sach.active });
  fetchAll();
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white p-4 rounded shadow">
      <h3 class="font-semibold mb-3">{{ editingId ? 'Sửa sách' : 'Thêm sách mới' }}</h3>
      <form @submit.prevent="submit" class="space-y-2">
        <input v-model="form.tenSach" placeholder="Tên sách" required class="border rounded px-3 py-2 w-full" />
        <input v-model.number="form.donGia" type="number" min="0" placeholder="Đơn giá" required class="border rounded px-3 py-2 w-full" />
        <input v-model.number="form.soQuyen" type="number" min="0" placeholder="Số quyển" required class="border rounded px-3 py-2 w-full" />
        <input v-model.number="form.namXuatBan" type="number" placeholder="Năm xuất bản" class="border rounded px-3 py-2 w-full" />
        <input v-model="form.tacGia" placeholder="Tác giả" class="border rounded px-3 py-2 w-full" />
        <select v-model="form.maNXB" required class="border rounded px-3 py-2 w-full">
          <option value="" disabled>-- Chọn NXB --</option>
          <option v-for="n in nxbs" :key="n._id" :value="n._id">{{ n.tenNhaXuatBan }}</option>
        </select>
        <div class="flex gap-2">
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded flex-1">{{ editingId ? 'Cập nhật' : 'Thêm' }}</button>
          <button v-if="editingId" type="button" @click="resetForm" class="bg-gray-300 px-4 py-2 rounded">Hủy</button>
        </div>
      </form>
    </div>
    <div class="bg-white p-4 rounded shadow">
      <h3 class="font-semibold mb-3">Danh sách sách</h3>
      <table class="w-full text-sm">
        <thead><tr class="text-left border-b"><th>Tên</th><th>SL</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>
          <tr v-for="sach in list" :key="sach._id" class="border-b">
            <td>{{ sach.tenSach }}</td>
            <td>{{ sach.soQuyen }}</td>
            <td>{{ sach.active ? 'Hiện' : 'Ẩn' }}</td>
            <td class="text-right space-x-2">
              <button @click="editSach(sach)" class="text-blue-600">Sửa</button>
              <button @click="toggleActive(sach)" class="text-red-500">{{ sach.active ? 'Ẩn' : 'Hiện' }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>