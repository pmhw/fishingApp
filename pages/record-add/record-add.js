// pages/record-add/record-add.js
Page({
  data: {
    fileList: [],
    spotName: '',
    fishType: '',
    weight: '',
    duration: '',
    weather: '晴天',
    remark: ''
  },

  onLoad() {},

  /** 选择/上传图片后：保证每项带 url 与 type，便于预览 */
  onAfterRead(e) {
    const { file } = e.detail
    const files = Array.isArray(file) ? file : [file]
    const newList = files.map(f => ({
      url: f.url || f.tempFilePath || f.path,
      type: 'image',
      name: f.name
    }))
    this.setData({
      fileList: [...this.data.fileList, ...newList]
    })
  },

  onDelete(e) {
    const { index } = e.detail
    const fileList = this.data.fileList.slice()
    fileList.splice(index, 1)
    this.setData({ fileList })
  },

  onSpotInput(e) {
    this.setData({ spotName: e.detail.value != null ? e.detail.value : e.detail })
  },
  onFishInput(e) {
    this.setData({ fishType: e.detail.value != null ? e.detail.value : e.detail })
  },
  onWeightInput(e) {
    this.setData({ weight: e.detail.value != null ? e.detail.value : e.detail })
  },
  onDurationInput(e) {
    this.setData({ duration: e.detail.value != null ? e.detail.value : e.detail })
  },
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value != null ? e.detail.value : e.detail })
  },

  onSubmit() {
    const { spotName, fishType, weight, duration, fileList } = this.data
    if (!spotName || !fishType) {
      wx.showToast({ title: '请填写钓场和鱼种', icon: 'none' })
      return
    }
    wx.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },

  onClickLeft() {
    wx.navigateBack()
  }
})
