// 提供最小的 uni mock，防止组件/工具引用时报错
globalThis.uni = {
  getStorageSync: () => '',
  showToast: () => {},
  request: () => {},
  navigateTo: () => {},
  setStorageSync: () => {}
}

