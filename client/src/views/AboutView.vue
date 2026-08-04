<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <section>
      <h2 class="text-lg font-semibold mb-2">Giới thiệu</h2>
      <p class="text-sm text-gray-600">
        Thư viện trực tuyến là nơi bạn tìm kiếm và đăng ký mượn sách nhanh chóng.
      </p>
    </section>
    <section>
      <h2 class="text-lg font-semibold mb-2">Hướng dẫn đặt sách</h2>
      <ol class="list-decimal list-inside text-sm text-gray-600 space-y-1">
        <li>Vào trang <RouterLink to="/" class="text-blue-500">Trang chủ</RouterLink> để tìm sách theo tên, tác giả hoặc NXB.</li>
        <li>Vào trang <RouterLink to="/muon-sach" class="text-blue-500">Mượn sách</RouterLink> và điền thông tin đăng ký mượn.</li>
      </ol>
    </section>
  </div>
</template>