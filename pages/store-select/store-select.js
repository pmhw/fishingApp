const app = getApp()
const { request, resolveAvatarUrl } = require('../../utils/util')

Page({
  data: {
    storeList: [],
    loading: false,
    currentStoreId: null,
    currentCity: '',
    cityList: ['广州市', '上海市', '北京市', '深圳市', '杭州市']
  },

  onLoad() {
    this.initCurrentStore()
    const initCity = this._getCity()
    this.setData({
      currentCity: initCity || this.data.cityList[0]
    })
    this.loadStores()
  },

  initCurrentStore() {
    let current = null
    if (app.globalData && app.globalData.currentStore) {
      current = app.globalData.currentStore
    } else {
      try {
        current = wx.getStorageSync('currentStore') || null
      } catch (e) {
        current = null
      }
    }
    if (current && current.id !== undefined && current.id !== null) {
      this.setData({ currentStoreId: current.id })
    }
  },

  loadStores() {
    this.setData({ loading: true })
    // 使用钓场 / 门店列表接口：GET /api/mini/venues
    const city = this.data.currentCity || this._getCity()
    request('api/mini/venues', {
      method: 'GET',
      data: {
        page: 1,
        limit: 10,
        keyword: '',
        city
      }
    })
      .then((res) => {
        const raw = res && res.data
        const list = Array.isArray(raw && raw.list) ? raw.list : (Array.isArray(raw) ? raw : [])
        const mapped = list.map((item) => ({
          ...item,
          // 统一封面图字段并拼接域名
          cover_image_resolved: resolveAvatarUrl(item.cover_image || ''),
          // 方便展示地区信息
          full_address: `${item.city || ''}${item.district || ''}${item.address || ''}`
        }))
        this.setData({
          storeList: mapped,
          loading: false
        })
      })
      .catch(() => {
        this.setData({ loading: false })
      })
  },

  _getCity() {
    // 优先使用当前门店的 city，其次使用首页设置的 currentRegion（若有需要可拓展到定位）
    try {
      if (app.globalData && app.globalData.currentStore && app.globalData.currentStore.city) {
        return app.globalData.currentStore.city
      }
    } catch (e) { /* ignore */ }
    try {
      const pages = getCurrentPages()
      const homePage = pages.find(p => p.route === 'pages/home/home')
      if (homePage && homePage.data && homePage.data.currentRegion) {
        return homePage.data.currentRegion
      }
    } catch (e) { /* ignore */ }
    return ''
  },

  onCitySelect(e) {
    const city = e.currentTarget.dataset.city
    if (!city || city === this.data.currentCity) return
    this.setData({ currentCity: city })
    this.loadStores()
  },

  onSelectStore(e) {
    const store = e.currentTarget.dataset.store
    if (!store) return
    try {
      if (app.globalData) {
        app.globalData.currentStore = store
      }
      wx.setStorageSync('currentStore', store)
    } catch (err) {
      console.error('保存当前门店失败', err)
    }
    wx.showToast({
      title: store.name ? `已切换到 ${store.name}` : '钓场已切换',
      icon: 'none',
      duration: 800
    })
    setTimeout(() => {
      wx.navigateBack()
    }, 600)
  }
})

