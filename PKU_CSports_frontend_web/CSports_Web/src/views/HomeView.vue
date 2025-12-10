<template>
  <div class="home-view">
    
    <section class="relative bg-gray-900 text-white h-[60vh] flex items-center justify-center overflow-hidden">
      </section>

    <section class="container mx-auto px-4 py-16">
      <h2 class="text-4xl font-bold text-gray-800 mb-10 border-b-4 border-blue-600 pb-2 inline-block">
        🔥 最新新闻
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <NewsCard 
          v-for="news in newsList"
          :key="news.id"
          :id="news.id" 
          :title="news.title" 
          :date="news.date" 
          :summary="news.summary" 
          :image="news.image" 
        />
      </div>

      <div class="text-center mt-12">
        <router-link to="/news" 
          class="text-blue-600 hover:text-blue-800 font-semibold text-lg border-b-2 border-blue-600 pb-1 transition duration-300">
          查看所有新闻和活动 >
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NewsCard from '../components/NewsCard.vue';

// 模拟后端返回的新闻列表数据
const newsList = ref([
    { id: 101, title: "校队成功卫冕！CS:GO 联赛夺冠回顾", date: "2025-12-01", summary: "在激烈的决赛中，CSports校队凭借精妙的战术和稳定的发挥，成功击败对手...", image: "https://placehold.co/600x400/2980b9/ffffff/png?text=News+Image+1" },
    { id: 102, title: "新生招募火热开启：寻找下一位电竞之星", date: "2025-11-20", summary: "欢迎所有热爱电竞的新生加入，涵盖英雄联盟、Valorant等多个项目...", image: "https://placehold.co/600x400/27ae60/ffffff/png?text=News+Image+2" },
    { id: 103, title: "CSports 组织线下观赛活动圆满成功", date: "2025-11-15", summary: "数百名同学齐聚一堂，共同见证了S赛的精彩瞬间，现场气氛热烈非凡...", image: "https://placehold.co/600x400/e67e22/ffffff/png?text=News+Image+3" },
]);

</script>