// pages/spots/spots.js
Page({
  data: {
    searchKeyword: '',
    sortText: '智能排序',
    priceText: '价格',
    distanceText: '距离',
    
    // 钓场列表
    spotList: [
      {
        id: 1,
        name: '阳光钓场',
        distance: '2.5km',
        address: 'XX路123号',
        rating: 4.8,
        price: '¥50/天',
        phone: '13800138000',
        latitude: 39.908823,
        longitude: 116.397470,
        hasWifi: true,
        hasParking: true,
        hasToilet: true,
        hasRestaurant: false
      },
      {
        id: 2,
        name: '清溪钓场',
        distance: '5.3km',
        address: 'XX路456号',
        rating: 4.6,
        price: '¥80/天',
        phone: '13800138001',
        latitude: 39.918823,
        longitude: 116.407470,
        hasWifi: true,
        hasParking: true,
        hasToilet: false,
        hasRestaurant: true
      },
      {
        id: 3,
        name: '湖畔钓场',
        distance: '8.1km',
        address: 'XX路789号',
        rating: 4.9,
        price: '¥100/天',
        phone: '13800138002',
        latitude: 39.928823,
        longitude: 116.417470,
        hasWifi: true,
        hasParking: true,
        hasToilet: true,
        hasRestaurant: true
      },
      {
        id: 4,
        name: '绿野钓场',
        distance: '12.5km',
        address: 'XX路321号',
        rating: 4.7,
        price: '¥60/天',
        phone: '13800138003',
        latitude: 39.938823,
        longitude: 116.427470,
        hasWifi: false,
        hasParking: true,
        hasToilet: true,
        hasRestaurant: false
      },
      {
        id: 5,
        name: '渔乐钓场',
        distance: '4.2km',
        address: 'XX路654号',
        rating: 4.5,
        price: '¥45/天',
        phone: '13800138004',
        latitude: 39.898823,
        longitude: 116.387470,
        hasWifi: true,
        hasParking: false,
        hasToilet: true,
        hasRestaurant: false
      },
      {
        id: 6,
        name: '山水钓场',
        distance: '15.8km',
        address: 'XX路987号',
        rating: 4.8,
        price: '¥120/天',
        phone: '13800138005',
        latitude: 39.948823,
        longitude: 116.437470,
        hasWifi: true,
        hasParking: true,
        hasToilet: true,
        hasRestaurant: true
      }
    ],
    
    displaySpots: []
  },

  onLoad() {
    this.setData({
      displaySpots: this.data.spotList
    })
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    this.filterSpots()
  },

  // 清除搜索
  onClearSearch() {
    this.setData({ searchKeyword: '' })
    this.filterSpots()
  },

  // 筛选钓场
  filterSpots() {
    let spots = [...this.data.spotList]
    const keyword = this.data.searchKeyword.toLowerCase()
    
    if (keyword) {
      spots = spots.filter(item => 
        item.name.toLowerCase().includes(keyword) ||
        item.address.includes(keyword)
      )
    }
    
    this.setData({ displaySpots: spots })
  },

  // 筛选栏点击
  onFilterTap(e) {
    const type = e.currentTarget.dataset.type
    wx.showToast({
      title: `选择${type === 'sort' ? '排序' : type === 'price' ? '价格' : '距离'}`,
      icon: 'none'
    })
    // 这里可以打开筛选弹窗
  },

  // 点击钓场
  onSpotTap(e) {
    const spot = e.currentTarget.dataset.spot
    wx.showToast({
      title: `查看 ${spot.name}`,
      icon: 'none'
    })
    // 这里可以跳转到钓场详情页
  },

  // 拨打电话
  onCallPhone(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  // 导航
  onNavigate(e) {
    const spot = e.currentTarget.dataset.spot
    wx.openLocation({
      latitude: spot.latitude,
      longitude: spot.longitude,
      name: spot.name,
      address: spot.address
    })
  }
})
