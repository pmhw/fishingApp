// components/login-modal/login-modal.js
const app = getApp()

Component({
  properties: {
    // 是否显示登录弹窗
    show: {
      type: Boolean,
      value: false
    },
    // 是否自动检查登录状态
    autoCheck: {
      type: Boolean,
      value: true
    }
  },

  data: {
    isLoggedIn: false
  },

  lifetimes: {
    attached() {
      if (this.properties.autoCheck) {
        this.checkLoginStatus()
      }
    }
  },

  observers: {
    'show'(newVal) {
      if (newVal && this.properties.autoCheck) {
        this.checkLoginStatus()
      }
    }
  },

  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
      const isLoggedIn = !!userInfo
      
      this.setData({
        isLoggedIn
      })
      
      // 如果已登录，自动关闭弹窗
      if (isLoggedIn && this.properties.show) {
        this.triggerEvent('login', { isLoggedIn: true })
        this.close()
      }
      
      return isLoggedIn
    },

    // 获取用户信息
    onGetUserInfo(e) {
      const { userInfo } = e.detail
      
      if (userInfo) {
        // 保存用户信息到全局和本地存储
        app.globalData.userInfo = userInfo
        wx.setStorageSync('userInfo', userInfo)
        
        // 获取微信登录凭证
        wx.login({
          success: (res) => {
            if (res.code) {
              // 这里可以发送 res.code 到后台换取 openId, sessionKey, unionId
              console.log(res.code)
              // 暂时只保存用户信息
              this.setData({
                isLoggedIn: true
              })
              
              // 触发登录成功事件
              this.triggerEvent('login', { 
                isLoggedIn: true,
                userInfo: userInfo,
                code: res.code
              })
              
              // 关闭弹窗
              this.close()
              
              wx.showToast({
                title: '登录成功',
                icon: 'success'
              })
            }
          },
          fail: (err) => {
            console.error('登录失败', err)
            wx.showToast({
              title: '登录失败，请重试',
              icon: 'none'
            })
          }
        })
      } else {
        wx.showToast({
          title: '需要授权才能使用',
          icon: 'none'
        })
      }
    },

    // 关闭弹窗
    onClose() {
      this.close()
    },

    // 点击遮罩层
    onMaskTap() {
      // 可以根据需求决定是否允许点击遮罩关闭
      // this.close()
    },

    // 关闭方法
    close() {
      this.setData({
        show: false
      })
      this.triggerEvent('close')
    },

    // 查看用户协议
    onAgreementTap() {
      wx.showToast({
        title: '查看用户协议',
        icon: 'none'
      })
      // 这里可以跳转到协议页面
    },

    // 查看隐私政策
    onPrivacyTap() {
      wx.showToast({
        title: '查看隐私政策',
        icon: 'none'
      })
      // 这里可以跳转到隐私政策页面
    }
  }
})
