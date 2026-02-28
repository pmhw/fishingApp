// pages/profile/profile.js
const app = getApp()

Page({
  data: {
    userInfo: null,
    needProfileAuth: false,
    // 用户等级信息
    userLevel: {
      title: '垂钓达人',
      level: '初级钓手',
      levelColor: '#87CEEB', // 浅蓝色
      points: 217,
      pointsMax: 500,
      pointsPercent: 43.4
    },
    
    // 快捷功能入口
    quickActions: [
      { id: 1, icon: '🎁', title: '生日礼遇', desc: '解锁专属惊喜', color: '#FF6B9D' },
      { id: 2, icon: '🎫', title: '商品礼券', desc: '1张/月', color: '#4ECDC4' },
      { id: 3, icon: '🛍️', title: '购物袋', desc: '线下消费专属', color: '#95E1D3' }
    ],
    
    // 我的资产
    assets: [
      { id: 1, name: '积分', value: 580, icon: '💰', hasDot: true },
      { id: 2, name: '优惠券', value: 3, icon: '🎫', hasDot: false },
      { id: 3, name: '徽章', value: 5, icon: '🏆', hasDot: false },
      { id: 4, name: '收藏', value: 8, icon: '⭐', hasDot: false }
    ],
    
    // 我的订单
    orderTypes: [
      { id: 1, icon: '🛒', name: '商城订单', count: 0 },
      { id: 2, icon: '📦', name: '预约订单', count: 2 },
      { id: 3, icon: '🎣', name: '垂钓订单', count: 5 },
      { id: 4, icon: '🎫', name: '积分订单', count: 0 },
      { id: 5, icon: '🎪', name: '活动订单', count: 1 }
    ],
    
    // 服务与工具
    services: [
      { id: 1, icon: '📍', name: '门店查询', color: '#FF6B6B' },
      { id: 2, icon: '🔍', name: '产品查询', color: '#4ECDC4' },
      { id: 3, icon: '💬', name: '客服中心', color: '#95E1D3' },
      { id: 4, icon: '📱', name: '关注公众号', color: '#FFD93D' },
      { id: 5, icon: '⚙️', name: '设置', color: '#6BCB77' },
      { id: 6, icon: '📋', name: '帮助中心', color: '#FF9F66' }
    ],
    
    // 促销横幅
    promotionBanner: {
      title: '垂钓会员卡',
      subtitle: 'FISHING MEMBERSHIP',
      desc: '享受专属权益',
      buttonText: '立即开通',
      image: '/images/member-card.jpg'
    },
    
    // 签到状态
    canSignIn: true
  },

  onLoad() {
    console.log('个人中心页面加载')
    this.getUserInfo()
    this.calculatePointsPercent()
  },

  onShow() {
    console.log('个人中心页面显示')
    this.checkLoginStatus()
  },

  // 获取用户信息（仅登录后从全局/缓存读取，不设模拟数据）
  getUserInfo() {
    const token = app.globalData.token || wx.getStorageSync('token')
    if (!token) return
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo,
        needProfileAuth: !userInfo.nickName || !userInfo.avatarUrl
      })
    }
  },

  // 计算积分百分比
  calculatePointsPercent() {
    const { points, pointsMax } = this.data.userLevel
    const percent = (points / pointsMax * 100).toFixed(1)
    this.setData({
      'userLevel.pointsPercent': percent
    })
  },

  // 签到
  onSignIn() {
    if (this.data.canSignIn) {
      this.setData({
        canSignIn: false,
        'userLevel.points': this.data.userLevel.points + 10
      })
      this.calculatePointsPercent()
      wx.showToast({
        title: '签到成功 +10积分',
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: '今日已签到',
        icon: 'none'
      })
    }
  },

  // 点击资产
  onAssetTap(e) {
    const asset = e.currentTarget.dataset.asset
    wx.showToast({
      title: `查看${asset.name}`,
      icon: 'none'
    })
  },

  // 点击订单类型
  onOrderTypeTap(e) {
    const orderType = e.currentTarget.dataset.type
    wx.showToast({
      title: `查看${orderType.name}`,
      icon: 'none'
    })
  },

  // 点击服务
  onServiceTap(e) {
    const service = e.currentTarget.dataset.service
    wx.showToast({
      title: service.name,
      icon: 'none'
    })
  },

  // 点击快捷功能
  onQuickActionTap(e) {
    const action = e.currentTarget.dataset.action
    wx.showToast({
      title: action.title,
      icon: 'none'
    })
  },

  // 点击促销横幅
  onPromotionTap() {
    wx.showToast({
      title: '开通会员卡',
      icon: 'none'
    })
  },

  // 查看个人信息
  onUserInfoTap() {
    wx.showToast({
      title: '查看个人信息',
      icon: 'none'
    })
  },

  // 检查登录状态：必须既有 userInfo 又有有效 token 才算登录成功
  checkLoginStatus() {
    const token = app.globalData.token || wx.getStorageSync('token')
    if (!token) {
      this.setData({ userInfo: null, needProfileAuth: false })
      return false
    }
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || null
    const needProfileAuth = !!userInfo && (!userInfo.nickName || !userInfo.avatarUrl)
    this.setData({
      userInfo,
      needProfileAuth
    })
    return !!userInfo
  },

  // 跳转独立登录页（参考 miniprogram-1）
  onShowLogin() {
    wx.navigateTo({ url: '/pages/login/login' })
  },

  // 完善头像昵称：跳转到「完善资料」页（chooseAvatar + nickname）
  onAuthProfile() {
    const token = app.globalData.token || wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }
    wx.navigateTo({ url: '/pages/login-profile/login-profile' })
  },

})
