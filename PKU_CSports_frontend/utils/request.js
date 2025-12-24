const baseURL = 'http://localhost:3000';

export function request(options) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token') || '';
    const finalUrl = options.url.startsWith('http') ? options.url : `${baseURL}${options.url}`;
    uni.request({
      ...options,
      url: finalUrl,
      header: {
        'Content-Type': 'application/json',
        ...(options.header || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      success: (res) => {
        // 诊断：返回字符串且像 HTML 时直接提示
        if (typeof res.data === 'string' && res.data.trim().startsWith('<')) {
          console.error('响应非 JSON，可能 404/500 或跨域：', {
            url: finalUrl,
            statusCode: res.statusCode,
            preview: res.data.slice(0, 200)
          });
          uni.showToast({ title: '接口返回异常(非JSON)', icon: 'none' });
          resolve(res);
          return;
        }
        
        // 处理 401 未授权错误（token 过期或无效）
        if (res.statusCode === 401) {
          const errorMsg = res.data?.message || '登录已过期，请重新登录';
          console.warn('Token 过期或无效:', errorMsg);
          
          // 清除本地存储的 token 和用户信息
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          
          // 显示提示并跳转到登录页
          uni.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          });
          
          // 延迟跳转，让用户看到提示
          setTimeout(() => {
            // 检查当前页面是否是登录页，避免重复跳转
            try {
              const pages = getCurrentPages();
              const currentPage = pages[pages.length - 1];
              if (currentPage && !currentPage.route.includes('login')) {
                uni.reLaunch({
                  url: '/pages/login/login'
                });
              }
            } catch (e) {
              // 如果获取页面失败，直接跳转
              uni.reLaunch({
                url: '/pages/login/login'
              });
            }
          }, 2000);
        }
        
        resolve(res);
      },
      fail: (err) => {
        console.error('请求失败', { url: finalUrl, err });
        reject(err);
      }
    });
  });
}

export function get(url, params = {}) {
  const query = Object.keys(params)
    .filter(k => params[k] !== undefined && params[k] !== '')
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
  return request({ url: query ? `${url}?${query}` : url, method: 'GET' });
}

export function post(url, data = {}) {
  return request({ url, method: 'POST', data });
}

export function patch(url, data = {}) {
  return request({ url, method: 'PATCH', data });
}

export { baseURL };

