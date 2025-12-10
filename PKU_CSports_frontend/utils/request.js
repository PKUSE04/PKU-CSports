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

