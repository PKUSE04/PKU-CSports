<template>
  <div class="news-detail-view bg-gray-50 py-10">
    <div class="container mx-auto px-4 max-w-4xl">

      <article class="bg-white p-6 rounded-lg shadow-xl mb-8">
        
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4 border-b pb-3">
          {{ newsItem.title }}
        </h1>

        <div class="text-sm text-gray-500 flex items-center space-x-4 mb-6">
          <span>📅 发布于: {{ newsItem.date }}</span>
          <span>👤 作者: {{ newsItem.author }}</span>
          <span class="text-blue-600">👁️ 阅读量: {{ newsItem.views }}</span>
        </div>

        <div class="prose max-w-none text-gray-700 leading-relaxed" v-html="newsItem.content">
          </div>

      </article>

      <div class="flex justify-start items-center space-x-6 p-4 bg-white rounded-lg shadow mb-8">
        
        <button 
          @click="toggleLike" 
          :class="[isLiked ? 'text-blue-600' : 'text-gray-500', 'flex items-center space-x-1 hover:text-blue-600 transition']"
        >
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path v-if="isLiked" fill-rule="evenodd" d="M15.75 4.5a3 3 0 11.83 5.41l-2.73 3.51a3.02 3.02 0 00-.02 3.65l-2.73 3.51a3 3 0 11.83 5.41h.01c-.81 0-1.57-.34-2.11-.93l-4.5-5.18a3.02 3.02 0 010-3.92l4.5-5.18c.54-.59 1.3-.93 2.11-.93h.01a3 3 0 012.83 2.11z" clip-rule="evenodd" />
            <path v-else d="M6.25 15.25a3 3 0 100 6h.01c.81 0 1.57-.34 2.11-.93l4.5-5.18a3.02 3.02 0 010-3.92l-4.5-5.18a3.02 3.02 0 01-2.11-.93h-.01c-.81 0-1.57.34-2.11.93l-4.5 5.18a3.02 3.02 0 000 3.92l4.5 5.18a3.02 3.02 0 002.11.93h.01zM11.25 4.5A3 3 0 1011.25 0 3 3 0 0011.25 4.5z" />
          </svg>
          <span class="text-sm font-medium">{{ newsItem.likes }}</span>
        </button>
        
        <button @click="shareArticle" class="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition">
          <span class="text-xl">🔗</span>
          <span class="text-sm font-medium">转发/分享</span>
        </button>

        <button @click="reportArticle" class="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition ml-auto">
          <span class="text-xl">🚨</span>
          <span class="text-sm font-medium">举报</span>
        </button>
      </div>

      <section class="bg-white p-6 rounded-lg shadow-xl">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">评论区 ({{ comments.length }})</h2>
        
        <div class="mb-6">
          <textarea 
            v-model="newComment"
            rows="3"
            placeholder="留下你的评论..."
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
          <button 
            @click="submitComment"
            :disabled="!newComment.trim()"
            class="mt-2 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            发表评论
          </button>
        </div>

        <div v-for="comment in comments" :key="comment.id" class="border-t pt-4 mt-4">
          <div class="flex items-start space-x-3">
            <span class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">{{ comment.author.charAt(0) }}</span>
            <div>
              <p class="font-semibold text-gray-800">{{ comment.author }} <span class="text-xs text-gray-500 ml-2">({{ comment.date }})</span></p>
              <p class="text-gray-700 mt-1">{{ comment.text }}</p>
            </div>
          </div>
        </div>

      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // 用于获取路由参数 (新闻 ID)

const route = useRoute();
const newsId = route.params.id; // 假设路由路径是 /news/:id

// --- 状态和数据 ---
const newsItem = ref({
  id: newsId,
  title: 'CSports 校园篮球赛圆满落幕，A队夺冠！',
  author: '体育新闻部',
  date: '2025-12-10',
  views: 1250,
  likes: 45,
  content: '<p>本年度的校园篮球赛于周末落下帷幕，经过激烈的角逐，A队凭借出色的团队配合和精准的投篮，最终以88:85的微弱优势战胜了B队，成功摘得桂冠。现场气氛热烈，观众席座无虚席...</p><p>这是后续的内容，**包括图片和视频**。我们旨在提供一个简洁而专业的新闻浏览体验。</p>',
});

const isLiked = ref(false);
const newComment = ref('');
const comments = ref([
    { id: 1, author: '张三', text: '比赛非常精彩，A队实至名归！', date: '1小时前' },
    { id: 2, author: '李四', text: '场地预定系统最近维护，希望能尽快恢复。', date: '30分钟前' },
]);

// --- 交互逻辑 ---

// 1. 调取后端数据 (模拟)
onMounted(async () => {
  // 实际项目中：await fetchNewsData(newsId);
  console.log(`正在加载新闻 ID: ${newsId} 的内容...`);
});

// 2. 点赞功能
const toggleLike = () => {
  if (isLiked.value) {
    newsItem.value.likes--;
  } else {
    newsItem.value.likes++;
  }
  isLiked.value = !isLiked.value;
  // 实际项目中：调用后端API更新点赞状态
};

// 3. 评论功能
const submitComment = () => {
  if (!newComment.value.trim()) return;

  const commentText = newComment.value;
  // 实际项目中：调用后端API保存评论
  
  // 前端乐观更新列表
  comments.value.unshift({
    id: Date.now(), // 临时ID
    author: '当前用户', // 假设已登录
    text: commentText,
    date: '刚刚',
  });
  
  newComment.value = ''; // 清空输入框
};

// 4. 转发/分享功能
const shareArticle = () => {
  // 实际项目中：复制链接到剪贴板，或者调用社交媒体分享API
  const url = window.location.href;
  navigator.clipboard.writeText(url);
  alert('文章链接已复制到剪贴板！');
};

// 5. 举报功能
const reportArticle = () => {
  const reason = prompt('请输入举报理由（必填）：');
  if (reason) {
    // 实际项目中：调用后端API提交举报信息
    alert(`已收到您的举报（ID: ${newsId}），理由：${reason}`);
  } else {
    alert('举报已取消。');
  }
};
</script>

<style scoped>
/* 使用 Tailwind Typography 插件提供的 'prose' 类来美化 v-html 渲染的内容 */
/* 如果你没有安装 @tailwindcss/typography 插件，需要手动添加样式 */
.prose {
  /* 确保文本内容有良好的可读性 */
  font-size: 1.05rem;
  line-height: 1.75;
}
</style>