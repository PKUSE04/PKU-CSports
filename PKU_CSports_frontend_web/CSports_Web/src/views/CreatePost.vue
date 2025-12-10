<template>
  <section class="container mx-auto px-4 py-16 max-w-2xl">
    <h1 class="text-2xl font-bold mb-4">发表新帖</h1>

    <form @submit.prevent="submitPost" class="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
        <input v-model="title" type="text" class="w-full border rounded px-3 py-2" placeholder="填入标题" required />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">内容</label>
        <textarea v-model="content" rows="8" class="w-full border rounded px-3 py-2" placeholder="写下你的内容..." required></textarea>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">发表后将显示在最新新闻中（当前为本地演示）</div>
        <div class="space-x-2">
          <button type="button" @click="clear" class="px-4 py-2 border rounded">清除</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">发表</button>
        </div>
      </div>
    </form>

    <div v-if="saved" class="mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded">
      发布成功！你可以在本地查看（右上角的路由跳转），或刷新页面查看发布后的列表（仅演示）。
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const title = ref('');
const content = ref('');
const saved = ref(false);
const router = useRouter();

function submitPost() {
  // 简单地把数据放到 localStorage（演示用）
  const posts = JSON.parse(localStorage.getItem('local_posts') || '[]');
  posts.unshift({ title: title.value, content: content.value, date: new Date().toISOString() });
  localStorage.setItem('local_posts', JSON.stringify(posts));
  saved.value = true;
  // 跳转到新闻页以示意（也可以留在当前页）
  setTimeout(() => {
    router.push('/news');
  }, 800);
}

function clear() {
  title.value = '';
  content.value = '';
  saved.value = false;
}
</script>
