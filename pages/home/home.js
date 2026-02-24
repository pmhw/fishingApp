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
      weatherTypeClass: 'sunny', // sunny, rainy, cloudy, snowy
      icon: '☀️',
      humidity: 65,
      hpa: 1013,
      windSpeed: 3.5,
      windDirection: '东北风',
      visibility: 10
    },
    // 动态效果数据
    particles: [],
    rainDrops: [],
    snowflakes: [],
    
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
    this.initWeatherAnimation()
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
    const weatherTypes = [
      { type: '晴天', class: 'sunny', icon: '☀️' },
      { type: '雨天', class: 'rainy', icon: '🌧️' },
      { type: '多云', class: 'cloudy', icon: '☁️' },
      { type: '雪天', class: 'snowy', icon: '❄️' }
    ]
    // 默认使用晴天，也可以随机选择：weatherTypes[Math.floor(Math.random() * weatherTypes.length)]
    const currentWeather = weatherTypes[1] // 默认晴天
    
    this.setData({
      weather: {
        temperature: 22,
        weatherType: currentWeather.type,
        weatherTypeClass: currentWeather.class,
        icon: currentWeather.icon,
        humidity: 65,
        hpa: 1013,
        windSpeed: 3.5,
        windDirection: '东北风',
        visibility: 10
      }
    })
    this.updateWeatherDisplay()
    this.initWeatherAnimation()
  },

  // 初始化天气动画数据
  initWeatherAnimation() {
    const weatherClass = this.data.weather.weatherTypeClass
    
    if (weatherClass === 'sunny') {
      // 生成粒子数据
      const particles = []
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2
        })
      }
      this.setData({ particles })
    } else if (weatherClass === 'rainy') {
      // 生成雨滴数据
      const rainDrops = []
      for (let i = 0; i < 20; i++) {
        rainDrops.push({
          x: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 0.5 + Math.random() * 0.5
        })
      }
      this.setData({ rainDrops })
    } else if (weatherClass === 'snowy') {
      // 生成雪花数据
      const snowflakes = []
      for (let i = 0; i < 12; i++) {
        snowflakes.push({
          x: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 3 + Math.random() * 2
        })
      }
      this.setData({ snowflakes })
    }
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
    // 跳转到钓场列表页面
    wx.navigateTo({
      url: '/pages/spots/spots'
    })
    // 这里可以跳转到钓场详情页
    // wx.navigateTo({
    //   url: `/pages/spot-detail/spot-detail?id=${spot.id}`
    // })
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
    const type = functionItem.type
    
    // 根据类型跳转到对应页面
    switch (type) {
      case 'spot':
        // 跳转到钓场列表页面
        wx.navigateTo({
          url: '/pages/spots/spots'
        })
        break
      case 'shop':
        // 跳转到商城页面
        wx.navigateTo({
          url: '/pages/shop/shop'
        })
        break
      case 'hotel':
        // 跳转到住宿页面
        wx.navigateTo({
          url: '/pages/hotel/hotel'
        })
        break
      case 'restaurant':
        // 餐饮功能（待开发）
        wx.showToast({
          title: '餐饮功能开发中',
          icon: 'none'
        })
        break
      case 'equipment':
        // 装备功能（待开发）
        wx.showToast({
          title: '装备功能开发中',
          icon: 'none'
        })
        break
      case 'activity':
        // 活动功能（待开发）
        wx.showToast({
          title: '活动功能开发中',
          icon: 'none'
        })
        break
      case 'community':
        // 社区功能（待开发）
        wx.showToast({
          title: '社区功能开发中',
          icon: 'none'
        })
        break
      case 'more':
        // 更多功能（待开发）
        wx.showToast({
          title: '更多功能开发中',
          icon: 'none'
        })
        break
      default:
        wx.showToast({
          title: `进入${functionItem.name}`,
          icon: 'none'
        })
    }
  },

  // 点击更多
  onMoreTap(e) {
    const type = e.currentTarget.dataset.type
    
    // 根据类型跳转到对应列表页
    switch (type) {
      case 'spot':
        // 跳转到钓场列表页面
        wx.navigateTo({
          url: '/pages/spots/spots'
        })
        break
      case 'shop':
        // 跳转到商城页面
        wx.navigateTo({
          url: '/pages/shop/shop'
        })
        break
      case 'hotel':
        // 跳转到住宿页面
        wx.navigateTo({
          url: '/pages/hotel/hotel'
        })
        break
      default:
        wx.showToast({
          title: '查看更多',
          icon: 'none'
        })
    }
  },

  // 点击商品
  onShopTap(e) {
    const shop = e.currentTarget.dataset.shop
    // 跳转到商城页面
    wx.navigateTo({
      url: '/pages/shop/shop'
    })
    // 这里可以跳转到商品详情页
    // wx.navigateTo({
    //   url: `/pages/product-detail/product-detail?id=${shop.id}`
    // })
  },

  // 点击住宿
  onHotelTap(e) {
    const hotel = e.currentTarget.dataset.hotel
    // 跳转到住宿列表页面
    wx.navigateTo({
      url: '/pages/hotel/hotel'
    })
    // 这里可以跳转到住宿详情页
    // wx.navigateTo({
    //   url: `/pages/hotel-detail/hotel-detail?id=${hotel.id}`
    // })
  },

  // 搜索按钮点击
  onSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
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
