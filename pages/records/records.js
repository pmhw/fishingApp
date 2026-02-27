// pages/records/records.js
const app = getApp()

Page({
  data: {
    userInfo: null,
    showLoginModal: false,
    records: [
      {
        id: 1,
        date: '2024-01-15',
        spotName: '阳光钓场',
        fishType: '草鱼',
        weight: '3.5kg',
        duration: '4小时',
        weather: '晴天',
        image: '/images/fish1.jpg'
      },
      {
        id: 2,
        date: '2024-01-10',
        spotName: '清溪钓场',
        fishType: '鲫鱼',
        weight: '1.2kg',
        duration: '3小时',
        weather: '多云',
        image: '/images/fish2.jpg'
      },
      {
        id: 3,
        date: '2024-01-05',
        spotName: '湖畔钓场',
        fishType: '鲤鱼',
        weight: '2.8kg',
        duration: '5小时',
        weather: '晴天',
        image: '/images/fish3.jpg'
      }
    ],
    totalRecords: 3,
    totalWeight: '7.5kg'
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    this.setData({ userInfo })
    return !!userInfo
  },

  onShowLogin() {
    this.setData({ showLoginModal: true })
  },

  onLoginSuccess(e) {
    const { userInfo } = e.detail || {}
    this.setData({
      userInfo: userInfo || app.globalData.userInfo,
      showLoginModal: false
    })
  },

  onLoginClose() {
    this.setData({ showLoginModal: false })
  },

  // 点击记录
  onRecordTap(e) {
    const record = e.currentTarget.dataset.record
    wx.showToast({
      title: `查看${record.date}的记录`,
      icon: 'none'
    })
  },

  // 添加记录（未登录先提示登录）
  onAddRecord() {
    if (!this.checkLoginStatus()) {
      this.onShowLogin()
      return
    }
    wx.navigateTo({
      url: '/pages/record-add/record-add'
    })
  },

  // 导航栏左侧点击（返回）
  onClickLeft() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack()
    } else {
      wx.switchTab({
        url: '/pages/home/home'
      })
    }
  },

  // 导航栏右侧点击
  onClickRight() {
    this.onAddRecord()
  }
})
