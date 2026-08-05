<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({ sach: { type: Object, required: true } });
const emit = defineEmits(['close']);
const router = useRouter();

function goToBorrow() {
  router.push({ path: '/muon-sach', query: { maSach: props.sach._id } });
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="emit('close')">
      <Transition
        appear
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
          <button @click="emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
          <h3 class="text-xl font-bold text-gray-900 pr-8">{{ sach.tenSach }}</h3>
          <p class="text-sm text-gray-500 mt-2">Tác giả: {{ sach.tacGia || 'Không rõ' }}</p>
          <p class="text-sm text-gray-500">NXB: {{ sach.maNXB?.tenNhaXuatBan || '—' }}</p>
          <p class="text-sm text-gray-500" v-if="sach.namXuatBan">Năm xuất bản: {{ sach.namXuatBan }}</p>
          <span class="inline-block text-xs font-medium mt-3 px-2.5 py-1 rounded-full"
            :class="sach.soQuyen > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'">
            {{ sach.soQuyen > 0 ? `Còn ${sach.soQuyen} quyển` : 'Hết sách' }}
          </span>
          <p class="text-sm text-gray-600 mt-4 leading-relaxed whitespace-pre-line">
            {{ sach.moTa || 'Chưa có tóm tắt cho sách này.' }}
          </p>
          <button
            @click="goToBorrow"
            :disabled="!(sach.active && sach.soQuyen > 0)"
            class="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium w-full mt-5 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Mượn sách này
          </button>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
