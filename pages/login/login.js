// 参考 miniprogram-1 登录页：只做 code 登录，需完善资料时跳转第二步
const app = getApp()
const { request } = require('../../utils/util')

Page({
  data: {},

  onLogin() {
    wx.login({
      success: (res) => {
        if (!res.code) {
          wx.showToast({ title: '登录失败，请重试', icon: 'none' })
          return
        }
        wx.showLoading({ title: '登录中...' })
        request('api/mini/login', {
          method: 'POST',
          data: { code: res.code }
        })
          .then((resp) => {
            wx.hideLoading()
            if (!resp || resp.code !== 0 || !resp.data || !resp.data.token) {
              wx.showToast({ title: (resp && resp.msg) || '登录失败', icon: 'none' })
              return
            }
            const { token, openid, user } = resp.data
            app.globalData.token = token
            app.globalData.openid = openid
            wx.setStorageSync('token', token)
            wx.setStorageSync('openid', openid)
            const serverUser = user || {}
            const hasProfile = !!(serverUser.nickname && serverUser.avatar)
            if (hasProfile) {
              const userInfo = {
                nickName: serverUser.nickname || '',
                avatarUrl: serverUser.avatar || '',
                gender: serverUser.gender,
                country: serverUser.country || '',
                province: serverUser.province || '',
                city: serverUser.city || ''
              }
              app.globalData.userInfo = userInfo
              wx.setStorageSync('userInfo', userInfo)
              wx.showToast({ title: '登录成功', icon: 'success' })
              wx.switchTab({ url: '/pages/profile/profile' })
            } else {
              wx.navigateTo({ url: '/pages/login-profile/login-profile' })
            }
          })
          .catch((err) => {
            wx.hideLoading()
            console.error('登录失败', err)
            wx.showToast({ title: '登录失败，请稍后重试', icon: 'none' })
          })
      },
      fail: () => wx.showToast({ title: '登录失败，请重试', icon: 'none' })
    })
  },

  onAgreement() {
    wx.showToast({ title: '用户协议', icon: 'none' })
  },

  onPrivacy() {
    wx.showToast({ title: '隐私政策', icon: 'none' })
  }
})
