// pages/search/search.js
const HISTORY_KEY = 'searchHistory'
const MAX_HISTORY = 10

Page({
  data: {
    keyword: '',
    historyList: [],
    resultList: []
  },

  onLoad() {
    this.loadHistory()
  },

  // 加载本地搜索历史
  loadHistory() {
    try {
      const list = wx.getStorageSync(HISTORY_KEY) || []
      this.setData({ historyList: list })
    } catch (e) {
      console.log('加载历史失败', e)
    }
  },

  // 保存本地搜索历史
  saveHistory(list) {
    this.setData({ historyList: list })
    try {
      wx.setStorageSync(HISTORY_KEY, list)
    } catch (e) {
      console.log('保存历史失败', e)
    }
  },

  // 输入变化
  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  // 清空输入
  onClearInput() {
    this.setData({
      keyword: '',
      resultList: []
    })
  },

  // 搜索确认（键盘回车）
  onConfirm() {
    this.doSearch(this.data.keyword)
  },

  // 历史点击
  onHistoryTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword })
    this.doSearch(keyword)
  },

  // 删除单条历史
  onHistoryDelete(e) {
    const index = e.currentTarget.dataset.index
    const list = [...this.data.historyList]
    list.splice(index, 1)
    this.saveHistory(list)
  },

  // 清空历史
  onClearHistory() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定要清空所有搜索记录吗？',
      success(res) {
        if (res.confirm) {
          that.saveHistory([])
        }
      }
    })
  },

  // 执行搜索
  doSearch(rawKeyword) {
    const keyword = (rawKeyword || '').trim()
    if (!keyword) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return
    }

    // 更新历史（去重 + 置顶）
    let list = this.data.historyList.filter(item => item !== keyword)
    list.unshift(keyword)
    if (list.length > MAX_HISTORY) {
      list = list.slice(0, MAX_HISTORY)
    }
    this.saveHistory(list)

    // 模拟搜索结果
    const resultList = [
      {
        id: 1,
        name: `关于「${keyword}」的商品`,
        desc: '跳转到商城查看相关商品',
        type: 'shop',
        typeText: '商品'
      },
      {
        id: 2,
        name: `包含「${keyword}」的钓场`,
        desc: '跳转到钓场列表查看',
        type: 'spot',
        typeText: '钓场'
      }
    ]

    this.setData({ resultList })
  },

  // 结果点击
  onResultTap(e) {
    const item = e.currentTarget.dataset.item
    if (item.type === 'shop') {
      wx.navigateTo({
        url: '/pages/shop/shop'
      })
    } else if (item.type === 'spot') {
      wx.navigateTo({
        url: '/pages/spots/spots'
      })
    } else {
      wx.showToast({
        title: '暂不支持的类型',
        icon: 'none'
      })
    }
  },

  // 取消返回
  onCancel() {
    wx.navigateBack({
      delta: 1
    })
  }
})

