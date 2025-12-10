<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-extrabold text-gray-800 mb-8 border-b-2 pb-2">
      🗞️ 新闻中心
    </h1>

    <div class="flex flex-col md:flex-row justify-between items-center mb-10 p-4 bg-gray-50 rounded-lg shadow-sm">
      
      <div class="mb-4 md:mb-0">
        <label for="category" class="font-semibold text-gray-700 mr-3">按分类筛选:</label>
        <select id="category" v-model="selectedCategory" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">所有新闻</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
      <div>
        <input type="text" placeholder="搜索关键词..." class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64">
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <NewsCard 
        v-for="news in filteredNews" 
        :key="news.id" 
        :id="news.id"
        :title="news.title" 
        :date="news.date" 
        :summary="news.summary"
        :image="news.image" 
      />
    </div>

    <div v-if="filteredNews.length === 0" class="text-center py-20 text-gray-500">
      该分类下暂无新闻。
    </div>
    <div class="text-center mt-12">
      <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-300">
        加载更多...
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NewsCard from '../components/NewsCard.vue';

const selectedCategory = ref('all');
const categories = ref(['比赛回顾', '社团活动', '招募信息', '技术分享']);

// --- 模拟新闻数据 (实际项目中将从 API 获取) ---
const allNews = ref([
  // 使用之前 HomeView 的数据
  { id: 1, title: '校队成功卫冕！CS:GO 联赛夺冠回顾', date: '2025-12-01', summary: '在激烈的决赛中，CSports校队凭借精妙的战术和稳定的发挥，成功击败对手...', category: '比赛回顾', image: 'https://placehold.co/600x400/2980b9/ffffff/png?text=News+1' },
  { id: 2, title: '新生招募火热开启：寻找下一位电竞之星', date: '2025-11-20', summary: '欢迎所有热爱电竞的新生加入，涵盖英雄联盟、Valorant等多个项目...', category: '招募信息', image: 'https://placehold.co/600x400/27ae60/ffffff/png?text=News+2' },
  { id: 3, title: 'CSports 组织线下观赛活动圆满成功', date: '2025-11-15', summary: '数百名同学齐聚一堂，共同见证了S赛的精彩瞬间，现场气氛热烈非凡...', category: '社团活动', image: 'https://placehold.co/600x400/e67e22/ffffff/png?text=News+3' },
  // 新增一些数据以测试筛选
  { id: 4, title: 'LoL 打野如何掌控节奏？技术分享会总结', date: '2025-11-05', summary: '专业教练分享打野思路，从视野布置到Gank时机，全面提升你的游戏理解...', category: '技术分享', image: 'https://placehold.co/600x400/607d8b/ffffff/png?text=News+4' },
  { id: 5, title: '社团年度大会及换届选举通知', date: '2025-10-28', summary: '通知全体成员参加年度会议，讨论社团未来发展方向并进行新一届骨干选举...', category: '社团活动', image: 'https://placehold.co/600x400/9b59b6/ffffff/png?text=News+5' },
]);
// ---------------------------------------------------

// 使用 computed 属性实现筛选逻辑
const filteredNews = computed(() => {
  if (selectedCategory.value === 'all') {
    return allNews.value;
  }
  return allNews.value.filter(news => news.category === selectedCategory.value);
});
</script>