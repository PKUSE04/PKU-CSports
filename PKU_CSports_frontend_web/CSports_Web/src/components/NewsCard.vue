<template>
  <router-link 
    :to="`/news/${id}`" 
    class="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 overflow-hidden group border border-gray-100"
  >
    <div class="relative overflow-hidden">
      <img :src="image" :alt="title" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
      <span class="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full opacity-90">
        {{ date }}
      </span>
    </div>

    <div class="p-6">
      <h3 class="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition duration-300 line-clamp-2">
        {{ title }}
      </h3>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ summary }}
      </p>
      
      <div class="text-blue-600 font-semibold flex items-center text-sm">
        阅读全文 
        <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
    </div>
  </router-link>
</template>

<script setup>
//import { defineProps } from 'vue';

// 定义组件接收的属性 (Props)
defineProps({
  // 必须添加 id，用于路由跳转
  id: {
    type: [String, Number],
    required: true,
    default: 100 // 仅用于占位，实际应该从父组件传递
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});
</script>