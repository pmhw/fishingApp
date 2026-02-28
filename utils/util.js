const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 小程序请求封装
 * @param {string} path 接口路径，如 api/mini/banners
 * @param {object} options 同 wx.request，method、data 等
 * @returns {Promise}
 */
function request(path, options = {}) {
  let baseUrl = ''
  let token = ''
  try {
    const app = getApp()
    baseUrl = (app && app.globalData && app.globalData.apiBaseUrl) || ''
    token = (app && app.globalData && app.globalData.token) || ''
  } catch (e) {
    console.warn('request: getApp 未就绪', e)
  }
  try {
    // 本地缓存优先，避免全局丢失时无权限
    token = wx.getStorageSync('token') || token || ''
  } catch (e) {
    console.warn('request: 读取本地 token 失败', e)
  }
  if (!baseUrl) {
    console.error('request: apiBaseUrl 未配置，请在 app.js 的 globalData 中设置 apiBaseUrl')
    return Promise.reject(new Error('apiBaseUrl 未配置'))
  }
  const url = baseUrl.replace(/\/$/, '') + '/' + String(path).replace(/^\//, '')
  console.log('request 请求:', url)
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          const msg = (res.data && res.data.msg) ? res.data.msg : ('HTTP ' + res.statusCode)
          console.error('request 失败:', url, res.statusCode, res.data)
          reject(new Error(msg))
        }
      },
      fail: (err) => {
        console.error('request 网络错误:', url, err)
        reject(err)
      }
    })
  })
}

/**
 * 上传本地临时文件到服务器（如 chooseAvatar 返回的临时路径）
 * @param {string} filePath 本地临时文件路径，如 http://tmp/xxx.jpeg
 * @returns {Promise<string>} 上传成功后返回文件 URL
 */
function uploadFile(filePath) {
  let baseUrl = ''
  let token = ''
  try {
    const app = getApp()
    baseUrl = (app && app.globalData && app.globalData.apiBaseUrl) || ''
    token = (app && app.globalData && app.globalData.token) || ''
  } catch (e) {}
  try {
    token = wx.getStorageSync('token') || token || ''
  } catch (e) {}
  if (!baseUrl) {
    return Promise.reject(new Error('apiBaseUrl 未配置'))
  }
  const url = baseUrl.replace(/\/$/, '') + '/api/mini/upload'
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url,
      filePath,
      name: 'file',
      header: token ? { Authorization: `Bearer ${token}` } : {},
      success: (res) => {
        try {
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          if (res.statusCode >= 200 && res.statusCode < 300 && data && data.url) {
            resolve(data.url)
          } else {
            reject(new Error((data && data.msg) || '上传失败'))
          }
        } catch (e) {
          reject(e)
        }
      },
      fail: reject
    })
  })
}

/**
 * 展示头像时拼接配置的域名（后端若只存相对路径如 /uploads/xxx.jpeg，需拼成完整 URL）
 * @param {string} url 头像地址，可为相对路径或完整 URL
 * @returns {string} 用于 <image src=""> 的完整地址
 */
function resolveAvatarUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed
  }
  let base = ''
  try {
    const app = getApp()
    base = (app && app.globalData && app.globalData.staticBaseUrl) ||
      (app && app.globalData && app.globalData.apiBaseUrl) ||
      ''
  } catch (e) {}
  base = (base || '').replace(/\/$/, '')
  if (!base) return trimmed
  return trimmed.startsWith('/') ? base + trimmed : base + '/' + trimmed
}

module.exports = {
  formatTime,
  request,
  uploadFile,
  resolveAvatarUrl
}
