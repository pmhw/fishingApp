// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    globalSystemInfo: null, // navBar组件需要的全局系统信息
    apiBaseUrl: 'https://fishing.kaiyuantong.cn',
    /** 静态资源（头像等）展示时拼接的域名，不配置则用 apiBaseUrl */
    staticBaseUrl: 'https://fishing.kaiyuantong.cn',
    /** 当前选中的门店（用于商品、钓位等按门店展示） */
    currentStore: null,
    /** 全局购物车 [{ id, name, price, image, quantity }] */
    cart: []
  }
})
