// pages/nearby/nearby.js
Page({
  data: {
    fishingSpots: [
      { 
        id: 1, 
        name: '阳光钓场', 
        distance: '2.5km', 
        address: 'XX路123号',
        rating: 4.8,
        price: '¥50/天',
        image: '/images/spot1.jpg'
      },
      { 
        id: 2, 
        name: '清溪钓场', 
        distance: '5.3km', 
        address: 'XX路456号',
        rating: 4.6,
        price: '¥80/天',
        image: '/images/spot2.jpg'
      },
      { 
        id: 3, 
        name: '湖畔钓场', 
        distance: '8.1km', 
        address: 'XX路789号',
        rating: 4.9,
        price: '¥100/天',
        image: '/images/spot3.jpg'
      }
    ],
    currentLocation: null
  },

  onLoad() {
    console.log('附近钓场页面加载')
    this.getLocation()
  },

  onShow() {
    console.log('附近钓场页面显示')
  },

  // 获取当前位置
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          currentLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        console.log('获取位置成功', res)
      },
      fail: (err) => {
        console.log('获取位置失败', err)
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        })
      }
    })
  },

  // 点击钓场
  onSpotTap(e) {
    const spot = e.currentTarget.dataset.spot
    wx.showToast({
      title: `点击了${spot.name}`,
      icon: 'none'
    })
  },

  // 导航到钓场
  onNavigate(e) {
    const spot = e.currentTarget.dataset.spot
    wx.openLocation({
      latitude: 39.908823,
      longitude: 116.397470,
      name: spot.name,
      address: spot.address
    })
  }
})
