// 使用官方 chooseAvatar + input type="nickname" 获取头像和昵称
const app = getApp()
const { request } = require('../../utils/util')

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    formNickname: '',
    formAvatar: '',
    defaultAvatarUrl,
    canSubmit: false
  },

  onLoad() {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      wx.navigateBack()
    }
  },

  checkSubmit() {
    const { formNickname, formAvatar } = this.data
    const nick = (formNickname && formNickname.trim()) || ''
    this.setData({ canSubmit: !!nick && !!formAvatar })
  },

  onNicknameInput(e) {
    const value = (e && e.detail && e.detail.value !== undefined) ? String(e.detail.value).trim() : ''
    this.setData({ formNickname: value })
    this.checkSubmit()
  },

  onNicknameBlur(e) {
    const value = (e && e.detail && e.detail.value !== undefined) ? String(e.detail.value).trim() : ''
    if (value !== this.data.formNickname) {
      this.setData({ formNickname: value })
      this.checkSubmit()
    }
  },

  onChooseAvatar(e) {
    const avatarUrl = (e && e.detail && e.detail.avatarUrl) ? e.detail.avatarUrl : ''
    if (avatarUrl) {
      this.setData({ formAvatar: avatarUrl })
      this.checkSubmit()
    }
  },

  onSave() {
    const { formNickname, formAvatar, formGender, formCountry, formProvince, formCity } = this.data
    const nick = (typeof formNickname === 'string' ? formNickname : '').trim()
    if (!nick) {
      wx.showToast({ title: '请先填写昵称', icon: 'none' })
      return
    }
    if (!formAvatar) {
      wx.showToast({ title: '请点击上方头像选择头像', icon: 'none' })
      return
    }
    wx.showLoading({ title: '保存中...' })
    request('api/mini/user/profile', {
      method: 'PUT',
      data: {
        nickname: nick,
        avatar: formAvatar,
        gender: formGender,
        country: formCountry || '',
        province: formProvince || '',
        city: formCity || ''
      }
    })
      .then(() => {
        wx.hideLoading()
        const userInfo = {
          nickName: nick,
          avatarUrl: formAvatar,
          gender: formGender,
          country: formCountry || '',
          province: formProvince || '',
          city: formCity || ''
        }
        app.globalData.userInfo = userInfo
        wx.setStorageSync('userInfo', userInfo)
        wx.showToast({ title: '保存成功', icon: 'success' })
        wx.switchTab({ url: '/pages/profile/profile' })
      })
      .catch((err) => {
        wx.hideLoading()
        console.error('更新资料失败', err)
        wx.showToast({ title: '保存失败，请重试', icon: 'none' })
      })
  }
})
