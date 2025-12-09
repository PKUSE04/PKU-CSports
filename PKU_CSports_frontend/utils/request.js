const baseURL = 'http://localhost:3000';

export function request(options) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token') || '';
    uni.request({
      ...options,
      url: options.url.startsWith('http') ? options.url : `${baseURL}${options.url}`,
      header: {
        'Content-Type': 'application/json',
        ...(options.header || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      success: (res) => resolve(res),
      fail: reject
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

