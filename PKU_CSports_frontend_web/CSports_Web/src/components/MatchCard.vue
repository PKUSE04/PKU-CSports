<template>
  <div :class="['p-6 rounded-xl shadow-lg transition duration-300 border', isResult ? 'bg-white hover:shadow-xl' : 'bg-blue-50 border-blue-200 hover:shadow-xl']">
    
    <div class="flex justify-between items-center border-b pb-3 mb-4">
      <span class="text-sm font-semibold px-3 py-1 rounded-full" 
            :class="isResult ? 'bg-gray-200 text-gray-700' : 'bg-blue-200 text-blue-800'">
        {{ match.game }}
      </span>
      
      <span v-if="!isResult" class="text-sm text-green-600 font-bold">
        即将开始
      </span>
      <span v-else class="text-sm text-red-600 font-bold">
        已结束
      </span>
    </div>

    <div class="flex items-center justify-between">
      
      <div class="flex-1 text-center pr-4">
        <p class="text-lg font-bold text-gray-800">{{ match.teamA }}</p>
      </div>

      <div class="flex-shrink-0 text-center w-20">
        <template v-if="isResult">
          <span class="text-3xl font-extrabold" 
                :class="match.scoreA > match.scoreB ? 'text-blue-600' : 'text-gray-400'">
            {{ match.scoreA }}
          </span>
          <span class="text-xl mx-1 text-gray-500">-</span>
          <span class="text-3xl font-extrabold" 
                :class="match.scoreB > match.scoreA ? 'text-blue-600' : 'text-gray-400'">
            {{ match.scoreB }}
          </span>
        </template>
        <template v-else>
          <span class="text-xl font-bold text-gray-500">VS</span>
        </template>
      </div>

      <div class="flex-1 text-center pl-4">
        <p class="text-lg font-bold text-gray-800">{{ match.teamB }}</p>
      </div>
    </div>
    
    <div class="mt-4 pt-4 border-t border-dashed text-sm text-gray-500">
      <div v-if="!isResult" class="flex justify-between">
        <p>⏰ **时间:** {{ match.time }}</p>
        <p>📍 **场地:** {{ match.venue }}</p>
      </div>
      <div v-else class="flex justify-between">
        <p>📅 **日期:** {{ match.date }}</p>
        <p>🏅 **胜者:** <span class="text-blue-600 font-bold">{{ match.winner }}</span></p>
      </div>
    </div>

  </div>
</template>

<script setup>
//import { defineProps } from 'vue';

defineProps({
  match: {
    type: Object,
    required: true
  },
  isResult: {
    type: Boolean,
    default: false
  }
});
</script>