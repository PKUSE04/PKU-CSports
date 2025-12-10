<template>
  <nav class="cs-nav sticky top-0 z-20">
    <div class="cs-container w-full px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="text-3xl font-extrabold text-blue-800 tracking-wider">
        CSports <span class="text-xs font-medium text-gray-500">PKU</span>
      </router-link>

      <div class="nav-links hidden md:flex">
        <router-link v-for="link in navLinks" :key="link.name" :to="link.path" class="nav-link text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-300 py-1 border-b-2 border-transparent hover:border-blue-600">
          {{ link.name }}
        </router-link>
      </div>

      <button @click="showMenu = !showMenu" class="md:hidden text-gray-700 hover:text-blue-600" aria-label="Toggle menu">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>

    <transition name="slide-fade">
      <div v-if="showMenu" class="mobile-menu md:hidden">
        <router-link v-for="link in navLinks" :key="link.name + '-mobile'" :to="link.path" @click="showMenu = false" class="mobile-link text-base font-medium text-gray-700 hover:text-blue-600">
          {{ link.name }}
        </router-link>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const showMenu = ref(false);
const navLinks = ref([
  { name: '首页', path: '/' },
  { name: '最新新闻', path: '/news' },
  { name: '比赛数据', path: '/schedule' },
  { name: '发表', path: '/create-post' },
  { name: '关于我们', path: '/about' },
]);
</script>

<style scoped>
.cs-nav {
  background: rgba(255,255,255,0.95);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
  border-bottom: 1px solid rgba(15,23,42,0.04);
}
.cs-container { align-items: center; }
.nav-links { display:flex; gap:1.25rem; align-items:center; flex-wrap:wrap; }
.nav-link { padding:0.25rem 0.25rem; white-space:nowrap; }
.mobile-menu { padding:0.5rem 1rem 1rem 1rem; display:flex; flex-direction:column; gap:0.5rem; background: rgba(255,255,255,0.98); border-top:1px solid rgba(15,23,42,0.04); box-shadow:0 6px 18px rgba(15,23,42,0.06); position:relative; }
.mobile-link { padding:0.5rem 0.25rem; }
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 200ms ease; }
.slide-fade-enter-from { opacity:0; transform: translateY(-6px); }
.slide-fade-enter-to { opacity:1; transform: translateY(0); }
.slide-fade-leave-from { opacity:1; }
.slide-fade-leave-to { opacity:0; transform: translateY(-4px); }
@media (min-width: 768px) { .mobile-menu { display:none; } }
</style>
