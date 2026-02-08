// pages/home/home.js
Page({
  data: {
    // 当前地区
    currentRegion: '北京市',
    regionList: ['北京市', '上海市', '广州市', '深圳市', '杭州市'],
    showRegionPicker: false,
    
    // 天气信息
    weather: {
      temperature: 22,
      weatherType: '晴天',
      humidity: 65,
      hpa: 1013,
      windSpeed: 3.5,
      windDirection: '东北风',
      visibility: 10
    },
    
    // 轮播图（包含排行榜）
    bannerList: [
      { 
        id: 1, 
        type: 'banner',
        title: '春季垂钓活动',
        image: '/images/banner1.jpg'
      },
      { 
        id: 2, 
        type: 'ranking',
        title: '本周排行榜',
        rankings: [
          { rank: 1, name: '张钓友', weight: '8.5kg', spot: '阳光钓场' },
          { rank: 2, name: '李钓友', weight: '7.2kg', spot: '清溪钓场' },
          { rank: 3, name: '王钓友', weight: '6.8kg', spot: '湖畔钓场' }
        ]
      },
      { 
        id: 3, 
        type: 'banner',
        title: '会员专享优惠',
        image: '/images/banner3.jpg'
      }
    ],
    currentBanner: 0,
    
    // 优质钓场推荐
    recommendedSpots: [
      {
        id: 1,
        name: '阳光钓场',
        distance: '2.5km',
        address: 'XX路123号',
        tags: ['wifi', 'parking', 'toilet'],
        phone: '13800138000',
        latitude: 39.908823,
        longitude: 116.397470,
        rating: 4.8,
        price: '¥50/天',
        image: '/images/spot1.jpg'
      },
      {
        id: 2,
        name: '清溪钓场',
        distance: '5.3km',
        address: 'XX路456号',
        tags: ['wifi', 'parking'],
        phone: '13800138001',
        latitude: 39.918823,
        longitude: 116.407470,
        rating: 4.6,
        price: '¥80/天',
        image: '/images/spot2.jpg'
      },
      {
        id: 3,
        name: '湖畔钓场',
        distance: '8.1km',
        address: 'XX路789号',
        tags: ['wifi', 'parking', 'toilet'],
        phone: '13800138002',
        latitude: 39.928823,
        longitude: 116.417470,
        rating: 4.9,
        price: '¥100/天',
        image: '/images/spot3.jpg'
      },
      {
        id: 4,
        name: '绿野钓场',
        distance: '12.5km',
        address: 'XX路321号',
        tags: ['parking', 'toilet'],
        phone: '13800138003',
        latitude: 39.938823,
        longitude: 116.427470,
        rating: 4.7,
        price: '¥60/天',
        image: '/images/spot4.jpg'
      }
    ],
    
    // 定位信息
    location: null,
    
    // 图标显示控制（如果图片存在则显示图片，否则显示emoji）
    iconPhone: false,
    iconNavigate: false,
    
    // 导航栏显示数据
    weatherDisplay: '',
    
    // 功能入口列表
    functionList: [
      { id: 1, name: '钓场', icon: '🎣', type: 'spot' },
      { id: 2, name: '商城', icon: '🛒', type: 'shop' },
      { id: 3, name: '住宿', icon: '🏨', type: 'hotel' },
      { id: 4, name: '餐饮', icon: '🍽️', type: 'restaurant' },
      { id: 5, name: '装备', icon: '🎒', type: 'equipment' },
      { id: 6, name: '活动', icon: '🎪', type: 'activity' },
      { id: 7, name: '社区', icon: '👥', type: 'community' },
      { id: 8, name: '更多', icon: '⋯', type: 'more' }
    ],
    
    // 商城商品列表
    shopList: [
      { id: 1, name: '鱼竿套装', price: 299, image: '/images/shop1.jpg', sales: 128 },
      { id: 2, name: '鱼饵组合', price: 89, image: '/images/shop2.jpg', sales: 256 },
      { id: 3, name: '钓箱', price: 199, image: '/images/shop3.jpg', sales: 89 },
      { id: 4, name: '浮漂套装', price: 59, image: '/images/shop4.jpg', sales: 312 },
      { id: 5, name: '鱼线', price: 39, image: '/images/shop5.jpg', sales: 567 },
      { id: 6, name: '鱼钩套装', price: 29, image: '/images/shop6.jpg', sales: 423 }
    ],
    
    // 住宿列表
    hotelList: [
      {
        id: 1,
        name: '湖畔度假村',
        distance: '3.2km',
        address: 'XX路888号',
        rating: 4.8,
        price: 288,
        tags: ['免费WiFi', '停车场', '早餐'],
        image: '/images/hotel1.jpg'
      },
      {
        id: 2,
        name: '渔家乐民宿',
        distance: '5.5km',
        address: 'XX路666号',
        rating: 4.6,
        price: 168,
        tags: ['免费WiFi', '农家菜'],
        image: '/images/hotel2.jpg'
      },
      {
        id: 3,
        name: '垂钓主题酒店',
        distance: '8.8km',
        address: 'XX路999号',
        rating: 4.9,
        price: 388,
        tags: ['免费WiFi', '停车场', '早餐', '健身房'],
        image: '/images/hotel3.jpg'
      }
    ]
  },

  onLoad() {
    console.log('首页加载')
    this.getLocation()
    this.getWeather()
    this.checkIcons()
    this.updateWeatherDisplay()
  },
  
  // 检测图标文件是否存在
  checkIcons() {
    // 检测电话图标
    wx.getFileSystemManager().access({
      filePath: `${wx.env.USER_DATA_PATH}/images/icons/phone.png`,
      success: () => {
        this.setData({ iconPhone: true })
      },
      fail: () => {
        // 使用相对路径检测
        this.setData({ iconPhone: false })
      }
    })
    
    // 检测导航图标
    wx.getFileSystemManager().access({
      filePath: `${wx.env.USER_DATA_PATH}/images/icons/navigate.png`,
      success: () => {
        this.setData({ iconNavigate: true })
      },
      fail: () => {
        this.setData({ iconNavigate: false })
      }
    })
  },

  onShow() {
    console.log('首页显示')
  },

  // 获取定位
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        console.log('获取位置成功', res)
        wx.showToast({
          title: '定位成功',
          icon: 'success',
          duration: 1500
        })
      },
      fail: (err) => {
        console.log('获取位置失败', err)
        wx.showToast({
          title: '定位失败',
          icon: 'none'
        })
      }
    })
  },

  // 获取天气（模拟数据）
  getWeather() {
    // 这里可以调用天气API
    // 暂时使用模拟数据
    this.setData({
      weather: {
        temperature: 22,
        weatherType: '晴天',
        humidity: 65,
        hpa: 1013,
        windSpeed: 3.5,
        windDirection: '东北风',
        visibility: 10
      }
    })
    this.updateWeatherDisplay()
  },

  // 更新天气显示文字
  updateWeatherDisplay() {
    const weather = this.data.weather
    if (weather) {
      this.setData({
        weatherDisplay: `${weather.temperature}° ${weather.weatherType}`
      })
    }
  },

  // 切换地区
  onRegionTap() {
    this.setData({
      showRegionPicker: true
    })
  },

  // 选择地区
  onRegionSelect(e) {
    const region = e.currentTarget.dataset.region
    this.setData({
      currentRegion: region,
      showRegionPicker: false
    })
    // 重新获取该地区的天气和钓场数据
    this.getWeather()
    this.updateWeatherDisplay()
    wx.showToast({
      title: `已切换到${region}`,
      icon: 'none'
    })
  },

  // 关闭地区选择器
  onRegionPickerClose() {
    this.setData({
      showRegionPicker: false
    })
  },

  // 进入排行榜
  onRankingTap() {
    wx.showToast({
      title: '进入排行榜',
      icon: 'none'
    })
    // 这里可以跳转到排行榜页面
  },

  // 轮播图切换
  onBannerChange(e) {
    this.setData({
      currentBanner: e.detail.current
    })
  },

  // 商城轮播图切换
  onShopSwiperChange(e) {
    // 可以在这里处理商城轮播切换逻辑
    console.log('商城轮播切换', e.detail.current)
  },

  // 点击钓场
  onSpotTap(e) {
    const spot = e.currentTarget.dataset.spot
    wx.showToast({
      title: `点击了${spot.name}`,
      icon: 'none'
    })
  },

  // 拨打电话
  onCallPhone(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
      success: () => {
        console.log('拨打电话成功')
      },
      fail: (err) => {
        console.log('拨打电话失败', err)
        wx.showToast({
          title: '拨打电话失败',
          icon: 'none'
        })
      }
    })
  },

  // 导航到钓场
  onNavigate(e) {
    const spot = e.currentTarget.dataset.spot
    wx.openLocation({
      latitude: spot.latitude,
      longitude: spot.longitude,
      name: spot.name,
      address: spot.address,
      scale: 18
    })
  },

  // 点击功能入口
  onFunctionTap(e) {
    const functionItem = e.currentTarget.dataset.function
    wx.showToast({
      title: `进入${functionItem.name}`,
      icon: 'none'
    })
    // 这里可以根据type跳转到不同页面
    // if (functionItem.type === 'shop') {
    //   wx.navigateTo({ url: '/pages/shop/shop' })
    // } else if (functionItem.type === 'hotel') {
    //   wx.navigateTo({ url: '/pages/hotel/hotel' })
    // }
  },

  // 点击更多
  onMoreTap(e) {
    const type = e.currentTarget.dataset.type
    const typeMap = {
      'spot': '钓场',
      'shop': '商城',
      'hotel': '住宿'
    }
    wx.showToast({
      title: `查看${typeMap[type] || '更多'}`,
      icon: 'none'
    })
    // 这里可以跳转到对应列表页
    // if (type === 'spot') {
    //   wx.switchTab({ url: '/pages/nearby/nearby' })
    // }
  },

  // 点击商品
  onShopTap(e) {
    const shop = e.currentTarget.dataset.shop
    wx.showToast({
      title: `查看${shop.name}`,
      icon: 'none'
    })
    // 这里可以跳转到商品详情页
  },

  // 点击住宿
  onHotelTap(e) {
    const hotel = e.currentTarget.dataset.hotel
    wx.showToast({
      title: `查看${hotel.name}`,
      icon: 'none'
    })
    // 这里可以跳转到住宿详情页
  },

  // 搜索按钮点击
  onSearch() {
    wx.showToast({
      title: '搜索功能',
      icon: 'none'
    })
    // 这里可以跳转到搜索页面
    // wx.navigateTo({
    //   url: '/pages/search/search'
    // })
  },

  // 天气点击
  onWeatherTap() {
    wx.showToast({
      title: '查看天气详情',
      icon: 'none'
    })
    // 这里可以显示天气详情或跳转到天气页面
  }
})
