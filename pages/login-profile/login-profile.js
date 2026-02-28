// 使用官方 chooseAvatar + input type="nickname" 获取头像和昵称
const app = getApp()
const { request, uploadFile, resolveAvatarUrl } = require('../../utils/util')

// 是否为本地临时路径（需先上传再传给后端）
function isTempFilePath(path) {
  if (!path || typeof path !== 'string') return false
  return path.startsWith('http://tmp/') || path.startsWith('wxfile://')
}

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    formNickname: '',
    formAvatar: '',
    formAvatarDisplay: '', // 展示用：拼接域名后的地址
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
    if (!avatarUrl) return
    const setAvatar = (url) => {
      this.setData({
        formAvatar: url,
        formAvatarDisplay: resolveAvatarUrl(url) || defaultAvatarUrl
      })
      this.checkSubmit()
    }
    if (isTempFilePath(avatarUrl)) {
      wx.showLoading({ title: '上传中...' })
      uploadFile(avatarUrl)
        .then((url) => {
          wx.hideLoading()
          setAvatar(url)
        })
        .catch((err) => {
          wx.hideLoading()
          console.error('头像上传失败', err)
          wx.showToast({ title: '头像上传失败，请重试', icon: 'none' })
        })
    } else {
      setAvatar(avatarUrl)
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
    const saveProfile = (avatarUrl) => {
      return request('api/mini/user/profile', {
        method: 'PUT',
        data: {
          nickname: nick,
          avatar: avatarUrl,
          gender: formGender,
          country: formCountry || '',
          province: formProvince || '',
          city: formCity || ''
        }
      }).then(() => {
        const userInfo = {
          nickName: nick,
          avatarUrl: avatarUrl,
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
    }
    if (isTempFilePath(formAvatar)) {
      wx.showLoading({ title: '上传头像中...' })
      uploadFile(formAvatar)
        .then((url) => {
          wx.showLoading({ title: '保存中...' })
          return saveProfile(url)
        })
        .then(() => wx.hideLoading())
        .catch((err) => {
          wx.hideLoading()
          console.error('上传或保存失败', err)
          wx.showToast({ title: '保存失败，请重试', icon: 'none' })
        })
      return
    }
    wx.showLoading({ title: '保存中...' })
    saveProfile(formAvatar).then(() => wx.hideLoading()).catch((err) => {
      wx.hideLoading()
      console.error('更新资料失败', err)
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
    })
  }
})
