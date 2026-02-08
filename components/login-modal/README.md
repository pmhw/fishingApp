# 登录弹窗组件 (login-modal)

统一的登录/未登录界面组件，可以在多个页面复用。

## 功能特性

- ✅ 统一的登录界面设计
- ✅ 自动检测登录状态
- ✅ 微信一键登录
- ✅ 用户信息存储（全局 + 本地存储）
- ✅ 登录成功回调
- ✅ 优雅的动画效果

## 使用方法

### 1. 在页面 JSON 中引入组件

```json
{
  "usingComponents": {
    "login-modal": "/components/login-modal/login-modal"
  }
}
```

### 2. 在页面 WXML 中使用

```xml
<login-modal 
  show="{{showLoginModal}}" 
  autoCheck="{{true}}"
  bind:login="onLoginSuccess"
  bind:close="onLoginClose"
/>
```

### 3. 在页面 JS 中处理事件

```javascript
Page({
  data: {
    showLoginModal: false
  },

  // 显示登录弹窗
  onShowLogin() {
    this.setData({
      showLoginModal: true
    })
  },

  // 登录成功回调
  onLoginSuccess(e) {
    const { userInfo, code } = e.detail
    console.log('登录成功', userInfo)
    // 可以在这里发送 code 到服务器换取 session
    this.setData({
      showLoginModal: false
    })
  },

  // 关闭弹窗
  onLoginClose() {
    this.setData({
      showLoginModal: false
    })
  }
})
```

## 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| show | Boolean | false | 是否显示登录弹窗 |
| autoCheck | Boolean | true | 是否自动检查登录状态 |

## 事件说明

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| login | 登录成功时触发 | { userInfo, code, isLoggedIn } |
| close | 关闭弹窗时触发 | - |

## 登录状态管理

组件会自动将用户信息保存到：
- `app.globalData.userInfo` (全局数据)
- `wx.getStorageSync('userInfo')` (本地存储)

其他页面可以通过以下方式检查登录状态：

```javascript
const app = getApp()
const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
if (userInfo) {
  // 已登录
} else {
  // 未登录
}
```

## 完整示例

### 个人中心页面示例

```xml
<!-- 未登录状态 -->
<view wx:if="{{!userInfo}}">
  <button bindtap="onShowLogin">立即登录</button>
</view>

<!-- 已登录状态 -->
<view wx:else>
  <!-- 用户信息展示 -->
</view>

<!-- 登录组件 -->
<login-modal 
  show="{{showLoginModal}}" 
  bind:login="onLoginSuccess"
/>
```

## 注意事项

1. 需要在小程序后台配置用户信息授权
2. 登录成功后，建议将 `code` 发送到服务器换取 `openId` 和 `sessionKey`
3. 用户信息存储在本地，清除缓存后需要重新登录
