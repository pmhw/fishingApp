// pages/member-code/member-code.js
Page({
  data: {
    // 二维码图案（模拟数据）
    qrPattern: [],
    // 折扣信息
    discount: 9,
    monthlyConsumption: '0.00',
    // 折扣等级
    discountLevels: [
      { level: 9, amount: 200, width: 33, active: true },
      { level: 6, amount: 400, width: 33, active: false },
      { level: 9, amount: 600, width: 34, active: false }
    ]
  },

  onLoad() {
    console.log('会员码页面加载')
    this.generateQRPattern()
  },

  onShow() {
    console.log('会员码页面显示')
  },

  // 生成二维码图案（模拟）
  generateQRPattern() {
    // 生成一个简单的二维码图案（25x25）
    const pattern = []
    for (let i = 0; i < 25; i++) {
      const row = []
      for (let j = 0; j < 25; j++) {
        // 随机生成黑白点，但确保四个角是黑色（二维码特征）
        if ((i < 7 && j < 7) || (i < 7 && j >= 18) || (i >= 18 && j < 7)) {
          row.push(true) // 黑色
        } else {
          row.push(Math.random() > 0.5) // 随机
        }
      }
      pattern.push(row)
    }
    this.setData({
      qrPattern: pattern
    })
  },

  // 刷新二维码
  onRefreshQR() {
    wx.showLoading({
      title: '刷新中...'
    })
    setTimeout(() => {
      this.generateQRPattern()
      wx.hideLoading()
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      })
    }, 1000)
  },

  // 开通服务
  onOpenService() {
    wx.showToast({
      title: '开通垂钓服务',
      icon: 'none'
    })
  },

  // 查看行程
  onViewTrips() {
    wx.showToast({
      title: '查看我的行程',
      icon: 'none'
    })
  },

  // 查看常见问题
  onViewFAQ() {
    wx.showToast({
      title: '查看常见问题',
      icon: 'none'
    })
  }
})
