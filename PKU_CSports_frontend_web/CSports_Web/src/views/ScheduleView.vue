<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-extrabold text-gray-800 mb-8 border-b-2 pb-2">
      🏆 赛程与赛果
    </h1>

    <div class="flex border-b border-gray-200 mb-8">
      <button 
        @click="activeTab = 'upcoming'"
        :class="['px-6 py-3 text-lg font-semibold transition duration-200', activeTab === 'upcoming' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-700']">
        即将开始 ({{ upcomingMatches.length }})
      </button>

      <button 
        @click="activeTab = 'results'"
        :class="['px-6 py-3 text-lg font-semibold transition duration-200', activeTab === 'results' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-700']">
        已结束赛果 ({{ results.length }})
      </button>
    </div>

    <div class="space-y-6">
      <div v-if="activeTab === 'upcoming'">
        <h2 class="text-2xl font-bold mb-4 text-gray-700">近期比赛安排</h2>
        
        <MatchCard v-for="match in upcomingMatches" :key="match.id" :match="match" :is-result="false" />
        
        <p v-if="upcomingMatches.length === 0" class="text-gray-500 text-center py-10 border rounded-lg mt-6">
          暂无即将开始的比赛安排。
        </p>
      </div>

      <div v-else-if="activeTab === 'results'">
        <h2 class="text-2xl font-bold mb-4 text-gray-700">最新比赛结果</h2>
        
        <MatchCard v-for="match in results" :key="match.id" :match="match" :is-result="true" />

        <p v-if="results.length === 0" class="text-gray-500 text-center py-10 border rounded-lg mt-6">
          暂无比赛结果数据。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// 导入比赛卡片组件 (下一步创建)
import MatchCard from '../components/MatchCard.vue'; 

const activeTab = ref('upcoming'); // 默认显示“即将开始”

// --- 模拟比赛数据 (实际项目中将从 API 获取) ---
const upcomingMatches = ref([
  { id: 1, game: '英雄联盟', teamA: 'PKU CSports A队', teamB: '清华大学 TUS', time: '12月15日 19:00', venue: '线上直播' },
  { id: 2, game: 'Valorant', teamA: 'CSports 女队', teamB: 'BNU 战队', time: '12月18日 20:30', venue: '校内场馆' },
]);

const results = ref([
  { id: 3, game: 'CS2', teamA: 'PKU CSports', teamB: 'RUC RAPTORS', scoreA: 2, scoreB: 1, winner: 'PKU CSports', date: '12月01日' },
  { id: 4, game: 'DOTA2', teamA: '新生挑战队', teamB: '老将联队', scoreA: 0, scoreB: 2, winner: '老将联队', date: '11月28日' },
]);
// ---------------------------------------------------
</script>