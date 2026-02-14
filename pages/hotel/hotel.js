// pages/hotel/hotel.js
Page({
  data: {
    searchKeyword: '',
    sortText: '智能排序',
    priceText: '价格',
    distanceText: '距离',
    
    // 住宿列表
    hotelList: [
      {
        id: 1,
        name: '湖畔度假村',
        distance: '3.2km',
        address: 'XX路888号',
        rating: 4.8,
        price: 288,
        phone: '13800138000',
        latitude: 39.908823,
        longitude: 116.397470,
        tags: ['免费WiFi', '停车场', '早餐']
      },
      {
        id: 2,
        name: '渔家乐民宿',
        distance: '5.5km',
        address: 'XX路666号',
        rating: 4.6,
        price: 168,
        phone: '13800138001',
        latitude: 39.918823,
        longitude: 116.407470,
        tags: ['免费WiFi', '农家菜']
      },
      {
        id: 3,
        name: '垂钓主题酒店',
        distance: '8.8km',
        address: 'XX路999号',
        rating: 4.9,
        price: 388,
        phone: '13800138002',
        latitude: 39.928823,
        longitude: 116.417470,
        tags: ['免费WiFi', '停车场', '早餐', '健身房']
      },
      {
        id: 4,
        name: '水边小筑',
        distance: '2.1km',
        address: 'XX路123号',
        rating: 4.7,
        price: 198,
        phone: '13800138003',
        latitude: 39.898823,
        longitude: 116.387470,
        tags: ['免费WiFi', '停车场']
      },
      {
        id: 5,
        name: '钓鱼人客栈',
        distance: '6.3km',
        address: 'XX路456号',
        rating: 4.5,
        price: 158,
        phone: '13800138004',
        latitude: 39.938823,
        longitude: 116.427470,
        tags: ['免费WiFi', '农家菜', '垂钓指导']
      }
    ],
    
    displayHotels: []
  },

  onLoad() {
    this.setData({
      displayHotels: this.data.hotelList
    })
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    this.filterHotels()
  },

  // 清除搜索
  onClearSearch() {
    this.setData({ searchKeyword: '' })
    this.filterHotels()
  },

  // 筛选住宿
  filterHotels() {
    let hotels = [...this.data.hotelList]
    const keyword = this.data.searchKeyword.toLowerCase()
    
    if (keyword) {
      hotels = hotels.filter(item => 
        item.name.toLowerCase().includes(keyword) ||
        item.address.includes(keyword)
      )
    }
    
    this.setData({ displayHotels: hotels })
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

  // 点击住宿
  onHotelTap(e) {
    const hotel = e.currentTarget.dataset.hotel
    wx.showToast({
      title: `查看 ${hotel.name}`,
      icon: 'none'
    })
    // 这里可以跳转到住宿详情页
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
    const hotel = e.currentTarget.dataset.hotel
    wx.openLocation({
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      name: hotel.name,
      address: hotel.address
    })
  }
})
