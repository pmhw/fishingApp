// components/login-modal/login-modal.js
const app = getApp()
const { request, uploadFile, resolveAvatarUrl } = require('../../utils/util')

function isTempFilePath(path) {
  if (!path || typeof path !== 'string') return false
  return path.startsWith('http://tmp/') || path.startsWith('wxfile://')
}

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  properties: {
    // 是否显示登录弹窗
    show: {
      type: Boolean,
      value: false
    },
    // 是否自动检查登录状态
    autoCheck: {
      type: Boolean,
      value: true
    }
  },

  data: {
    isLoggedIn: false,
    step: 1,
    formNickname: '',
    formAvatar: '',
    formAvatarDisplay: '',
    defaultAvatarUrl,
    formGender: null,
    formCountry: '',
    formProvince: '',
    formCity: ''
  },

  lifetimes: {
    attached() {
      if (this.properties.autoCheck) {
        this.checkLoginStatus()
      }
    }
  },

  observers: {
    'show'(newVal) {
      if (newVal) {
        this.setData({ step: 1, formNickname: '', formAvatar: '', formAvatarDisplay: '', formGender: null, formCountry: '', formProvince: '', formCity: '' })
        if (this.properties.autoCheck) this.checkLoginStatus()
      }
    }
  },

  methods: {
    // 检查登录状态：必须既有 token 又有 userInfo 才算已登录
    checkLoginStatus() {
      const token = app.globalData.token || wx.getStorageSync('token')
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
      const isLoggedIn = !!token && !!userInfo

      this.setData({
        isLoggedIn
      })

      // 如果已登录且当前弹窗是打开的，则自动关闭
      if (isLoggedIn && this.properties.show) {
        this.close()
      }

      return isLoggedIn
    },

    // 点击登录：只传 code，服务端返回 token 和 user；首次登录（无头像或昵称）进入第二步完善资料
    onTapLogin() {
      wx.login({
        success: (res) => {
          if (!res.code) {
            wx.showToast({ title: '登录失败，请重试', icon: 'none' })
            return
          }
          wx.showLoading({ title: '登录中...' })
          request('api/mini/login', {
            method: 'POST',
            data: { code: res.code }
          })
            .then((resp) => {
              wx.hideLoading()
              if (!resp || resp.code !== 0 || !resp.data || !resp.data.token) {
                const msg = (resp && resp.msg) || '登录失败，请稍后重试'
                wx.showToast({ title: msg, icon: 'none' })
                return
              }
              const { token, openid, user } = resp.data
              app.globalData.token = token
              app.globalData.openid = openid
              wx.setStorageSync('token', token)
              wx.setStorageSync('openid', openid)
              const serverUser = user || {}
              const hasProfile = !!(serverUser.nickname && serverUser.avatar)
              if (hasProfile) {
                const userInfo = {
                  nickName: serverUser.nickname || '',
                  avatarUrl: serverUser.avatar || '',
                  gender: serverUser.gender,
                  country: serverUser.country || '',
                  province: serverUser.province || '',
                  city: serverUser.city || ''
                }
                app.globalData.userInfo = userInfo
                wx.setStorageSync('userInfo', userInfo)
                this.setData({ isLoggedIn: true })
                this.triggerEvent('login', { isLoggedIn: true, userInfo, token, openid })
                this.close()
                wx.showToast({ title: '登录成功', icon: 'success' })
              } else {
                const avatar = serverUser.avatar || ''
                this.setData({
                  step: 2,
                  formNickname: serverUser.nickname || '',
                  formAvatar: avatar,
                  formAvatarDisplay: resolveAvatarUrl(avatar) || defaultAvatarUrl,
                  formGender: serverUser.gender,
                  formCountry: serverUser.country || '',
                  formProvince: serverUser.province || '',
                  formCity: serverUser.city || ''
                })
              }
            })
            .catch((err) => {
              wx.hideLoading()
              console.error('登录接口调用失败', err)
              wx.showToast({ title: '登录失败，请稍后重试', icon: 'none' })
            })
        },
        fail: (err) => {
          console.error('登录失败', err)
          wx.showToast({ title: '登录失败，请重试', icon: 'none' })
        }
      })
    },

    onChooseAvatar(e) {
      const avatarUrl = (e && e.detail && e.detail.avatarUrl) ? e.detail.avatarUrl : ''
      if (!avatarUrl) return
      const setAvatar = (url) => {
        this.setData({
          formAvatar: url,
          formAvatarDisplay: resolveAvatarUrl(url) || defaultAvatarUrl
        })
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
            wx.showToast({ title: '头像上传失败，请重试', icon: 'none' })
          })
      } else {
        setAvatar(avatarUrl)
      }
    },

    onFormNicknameInput(e) {
      this.setData({ formNickname: (e.detail && e.detail.value) || '' })
    },

    // 保存昵称、头像等到服务器并完成登录
    onSaveProfile() {
      const { formNickname, formAvatar, formGender, formCountry, formProvince, formCity } = this.data
      const nick = (formNickname && formNickname.trim()) || ''
      if (!nick) {
        wx.showToast({ title: '请填写昵称', icon: 'none' })
        return
      }
      if (!formAvatar) {
        wx.showToast({ title: '请点击头像选择头像', icon: 'none' })
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
          this.setData({ isLoggedIn: true })
          this.triggerEvent('login', { isLoggedIn: true, userInfo, token: app.globalData.token, openid: app.globalData.openid })
          this.close()
          wx.showToast({ title: '保存成功，登录完成', icon: 'success' })
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
            wx.showToast({ title: '保存失败，请重试', icon: 'none' })
          })
        return
      }
      wx.showLoading({ title: '保存中...' })
      saveProfile(formAvatar).then(() => wx.hideLoading()).catch((err) => {
        wx.hideLoading()
        wx.showToast({ title: '保存失败，请重试', icon: 'none' })
      })
    },

    // 关闭弹窗
    onClose() {
      this.close()
    },

    // 点击遮罩层
    onMaskTap() {
      // 可以根据需求决定是否允许点击遮罩关闭
      // this.close()
    },

    // 关闭方法
    close() {
      this.setData({
        show: false
      })
      this.triggerEvent('close')
    },

    // 查看用户协议
    onAgreementTap() {
      wx.showToast({
        title: '查看用户协议',
        icon: 'none'
      })
      // 这里可以跳转到协议页面
    },

    // 查看隐私政策
    onPrivacyTap() {
      wx.showToast({
        title: '查看隐私政策',
        icon: 'none'
      })
      // 这里可以跳转到隐私政策页面
    }
  }
})
