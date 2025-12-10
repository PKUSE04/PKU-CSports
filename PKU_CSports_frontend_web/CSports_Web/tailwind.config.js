// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // 确保包含了所有 Vue 组件和脚本文件
  ],
  theme: {
    extend: {},
  },
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};