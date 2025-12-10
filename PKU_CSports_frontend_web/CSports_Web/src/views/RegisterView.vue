<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl">
      
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          创建 CSports 账号
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          已有账号？
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out">
            立即登录
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        
        <div class="rounded-md shadow-sm -space-y-px">
          
          <div>
            <label for="username" class="sr-only">用户名</label>
            <input 
              id="username" 
              name="username" 
              type="text" 
              autocomplete="username" 
              required 
              v-model="registerForm.username"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="用户名 (用于登录和显示)"
            >
          </div>
          
          <div>
            <label for="email" class="sr-only">邮箱地址</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              v-model="registerForm.email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="常用邮箱地址"
            >
          </div>
          
          <div>
            <label for="password" class="sr-only">密码</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="new-password" 
              required 
              v-model="registerForm.password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="密码"
            >
          </div>
          
          <div>
            <label for="password-confirm" class="sr-only">确认密码</label>
            <input 
              id="password-confirm" 
              name="password-confirm" 
              type="password" 
              autocomplete="new-password" 
              required 
              v-model="registerForm.passwordConfirm"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="确认密码"
            >
          </div>
        </div>
        
        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            <span v-if="isLoading">注册中...</span>
            <span v-else>免费注册账号</span>
          </button>
        </div>

        <div v-if="errorMessage" class="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
            {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="text-sm text-center text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
            {{ successMessage }}
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 表单数据绑定
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
});

// 状态管理
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// 注册处理函数
const handleRegister = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;
  
  // 1. 客户端验证：检查密码是否一致
  if (registerForm.value.password !== registerForm.value.passwordConfirm) {
    errorMessage.value = '两次输入的密码不一致，请检查。';
    isLoading.value = false;
    return;
  }

  // 2. 模拟 API 请求
  try {
    // 实际项目中：const response = await api.post('/auth/register', registerForm.value);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    // 注册成功逻辑
    successMessage.value = '注册成功！正在跳转到登录页面...';
    
    // 注册成功后跳转到登录页
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (error) {
    // 处理网络或服务器错误
    console.error('注册请求失败:', error);
    errorMessage.value = '注册失败，请稍后重试。或该用户名/邮箱已被占用。';
  } finally {
    // 注意：这里我们不立即设置 isLoading=false，因为成功后会跳转
    if (!successMessage.value) {
        isLoading.value = false;
    }
  }
};
</script>

<style scoped>
/* 隐藏屏幕阅读器的文本 - 与 LoginView 保持一致 */
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