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
  try {
    const app = getApp()
    baseUrl = (app && app.globalData && app.globalData.apiBaseUrl) || ''
  } catch (e) {
    console.warn('request: getApp 未就绪', e)
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

module.exports = {
  formatTime,
  request
}
