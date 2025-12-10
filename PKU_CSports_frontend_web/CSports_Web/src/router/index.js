import { createRouter, createWebHistory } from 'vue-router';

// 1. 定义路由组件
import HomeView from '../views/HomeView.vue';
import ScheduleView from '../views/ScheduleView.vue';
import NewsView from '../views/NewsView.vue';
import DownloadView from '../views/DownloadView.vue';
import AboutView from '../views/AboutView.vue';
import CreatePost from '../views/CreatePost.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import NewsDetailView from '../views/NewsDetailView.vue';

// 2. 定义路由规则
const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/schedule', name: 'Schedule', component: ScheduleView },
  { path: '/news', name: 'News', component: NewsView },
  { path: '/download', name: 'Download', component: DownloadView },
  { path: '/create-post', name: 'CreatePost', component: CreatePost },
  { path: '/about', name: 'About', component: AboutView },
  {path: '/login',name: 'login',component: LoginView,},
  {path: '/register', name: 'register',component: RegisterView, },
  {path: '/news/:id', name: 'NewsDetail',component: NewsDetailView, },
];

// 3. 创建路由器实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
