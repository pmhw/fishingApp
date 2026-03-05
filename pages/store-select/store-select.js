const app = getApp()
const { request } = require('../../utils/util')

Page({
  data: {
    storeList: [],
    loading: false,
    currentStoreId: null
  },

  onLoad() {
    this.initCurrentStore()
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
    request('api/mini/stores', { method: 'GET' })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : []
        this.setData({
          storeList: list,
          loading: false
        })
      })
      .catch(() => {
        this.setData({ loading: false })
      })
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
      title: store.name ? `已切换到 ${store.name}` : '门店已切换',
      icon: 'none',
      duration: 800
    })
    setTimeout(() => {
      wx.navigateBack()
    }, 600)
  }
})

