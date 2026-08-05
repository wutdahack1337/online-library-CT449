<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-2">Giới thiệu</h2>
      <p class="text-sm text-gray-600 leading-relaxed">
        Thư viện trực tuyến là nơi bạn tìm kiếm và đăng ký mượn sách nhanh chóng.
      </p>
    </section>
    <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-2">Hướng dẫn đặt sách</h2>
      <ol class="list-decimal list-inside text-sm text-gray-600 space-y-1.5">
        <li>Vào trang <RouterLink to="/" class="text-blue-500">Trang chủ</RouterLink> để tìm sách theo tên, tác giả hoặc NXB.</li>
        <li>Vào trang <RouterLink to="/muon-sach" class="text-blue-500">Mượn sách</RouterLink> và điền thông tin đăng ký mượn.</li>
      </ol>
    </section>
  </div>
</template>