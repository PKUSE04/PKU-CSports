<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl">
      
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录 CSports 平台
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或 
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out">
            立即注册新账号
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">邮箱地址 / 用户名</label>
            <input 
              id="email-address" 
              name="email" 
              type="text" 
              autocomplete="email" 
              required 
              v-model="loginForm.identifier"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="邮箱地址或用户名"
            >
          </div>
          
          <div>
            <label for="password" class="sr-only">密码</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              v-model="loginForm.password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="密码"
            >
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              记住我
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out">
              忘记密码?
            </a>
          </div>
        </div>
        
        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <span v-if="isLoading">登录中...</span>
            <span v-else>立即登录</span>
          </button>
        </div>

        <div v-if="errorMessage" class="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
            {{ errorMessage }}
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 用于登录成功后的导航

const router = useRouter();

// 表单数据绑定
const loginForm = ref({
  identifier: '', // 可以是邮箱或用户名
  password: '',
});

// 状态管理
const isLoading = ref(false);
const errorMessage = ref('');

// 登录处理函数
const handleLogin = async () => {
  // 1. 清除旧错误信息
  errorMessage.value = '';
  isLoading.value = true;
  
  // 2. 模拟 API 请求
  try {
    // 实际项目中： const response = await api.post('/auth/login', loginForm.value);
    
    // 简单的客户端验证
    if (loginForm.value.identifier === 'test' && loginForm.value.password === '123') {
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // 登录成功逻辑
      console.log('登录成功！');
      // 实际项目中：将 token 存入本地存储，更新全局用户状态
      
      // 跳转到首页或用户仪表盘
      router.push('/'); 
    } else {
      // 登录失败
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      errorMessage.value = '用户名或密码错误，请重试。';
    }
    
  } catch (error) {
    // 处理网络或服务器错误
    console.error('登录请求失败:', error);
    errorMessage.value = '服务器连接失败，请检查网络。';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 这里不需要太多样式，Tailwind CSS 已经完成大部分工作 */
/* 隐藏屏幕阅读器的文本 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border-width: 0;
  white-space: nowrap;
}
</style>