// pages/webview/webview.js
Page({
  data: {
    url: ''
  },
  onLoad(options) {
    const url = options.url ? decodeURIComponent(options.url) : ''
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      wx.showToast({ title: '链接无效', icon: 'none' })
      return
    }
    this.setData({ url })
  }
})
