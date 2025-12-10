<template>
  <div class="bg-gray-900 border-b border-gray-700 text-gray-200 text-xs sm:text-sm w-full flex justify-end">
    <div class="px-4 py-2 flex justify-end items-center divide-x divide-gray-700" style="max-width: 480px;">
      <router-link to="/download" class="px-3 hover:text-blue-400 transition-colors">
        <span class="mr-1">📱</span> 下载 CSports App
      </router-link>
      
      <router-link to="/login" class="px-3 hover:text-blue-400 transition-colors">
        <span class="mr-1">🔑</span> 登录 / 注册
      </router-link>

      <div class="flex items-center space-x-2 pl-3">
        <span>关注我们:</span>
        <a href="#" class="hover:text-blue-400 transition-colors">
          <span class="text-base">💬</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
// 顶部工具栏逻辑（占位）
</script>
