# navBar 自定义导航栏组件使用说明

## 功能特性

- ✅ 自动适配状态栏高度（iOS/Android）
- ✅ 自动适配胶囊按钮位置
- ✅ 支持返回按钮和首页按钮
- ✅ 支持搜索栏功能
- ✅ 支持地址和天气显示
- ✅ 支持Logo显示
- ✅ 支持自定义背景色和文字颜色
- ✅ 支持插槽自定义（左侧、中间、右侧）
- ✅ 自动适配不同设备

## 使用方法

### 1. 在 app.js 中初始化（重要！）

组件依赖全局系统信息，需要在 `app.js` 中初始化：

```javascript
// app.js
App({
  globalData: {
    globalSystemInfo: null // 组件会自动初始化
  },
  onLaunch() {
    // 其他初始化代码
  }
})
```

### 2. 在页面 json 中配置

```json
{
  "navigationStyle": "custom",
  "usingComponents": {
    "nav-bar": "/components/navBar/navBar"
  }
}
```

### 3. 在页面 wxml 中使用

#### 基础用法（带标题）
```xml
<nav-bar 
  title="页面标题"
  background="#ffffff"
  color="#000000"
  back="{{true}}"
/>
```

#### 带返回和首页按钮
```xml
<nav-bar 
  title="页面标题"
  back="{{true}}"
  home="{{true}}"
  bind:back="onBack"
  bind:home="onHome"
/>
```

#### 带搜索栏
```xml
<nav-bar 
  searchBar="{{true}}"
  searchText="搜索内容"
  bind:search="onSearch"
/>
```

#### 带地址和天气
```xml
<nav-bar 
  searchBar="{{true}}"
  showaw="{{true}}"
  address="北京市"
  weather="22° 晴天"
  bind:weather="onWeather"
/>
```

#### 带Logo
```xml
<nav-bar 
  searchBar="{{true}}"
  showlogo="{{true}}"
  logoImage="/images/logo.png"
  bind:logo="onLogo"
/>
```

#### 使用插槽自定义
```xml
<nav-bar>
  <view slot="left">自定义左侧</view>
  <view slot="center">自定义中间</view>
  <view slot="right">自定义右侧</view>
</nav-bar>
```

### 4. 在页面 js 中处理事件

```javascript
Page({
  onBack(e) {
    // 返回按钮点击
    const delta = e.detail.delta || 1
    wx.navigateBack({ delta })
  },

  onHome() {
    // 首页按钮点击
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  onSearch() {
    // 搜索按钮点击
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  onWeather() {
    // 天气点击
    // 处理天气相关逻辑
  },

  onLogo() {
    // Logo点击
    // 处理Logo点击逻辑
  }
})
```

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | String | '' | 导航栏标题 |
| `background` | String | 'rgba(255, 255, 255, 1)' | 导航栏背景色 |
| `backgroundColorTop` | String | 'rgba(255, 255, 255, 1)' | 顶部状态栏背景色 |
| `color` | String | 'rgba(0, 0, 0, 1)' | 文字颜色 |
| `back` | Boolean | false | 是否显示返回按钮 |
| `home` | Boolean | false | 是否显示首页按钮 |
| `iconTheme` | String | 'black' | 图标主题：'black' 或 'white' |
| `searchBar` | Boolean | false | 是否显示搜索栏 |
| `searchText` | String | '点我搜索' | 搜索框占位文字 |
| `address` | String | '' | 地址文字 |
| `weather` | String | '' | 天气文字 |
| `showaw` | Boolean | false | 是否显示地址和天气 |
| `showlogo` | Boolean | false | 是否显示Logo |
| `logoImage` | String | '' | Logo图片路径 |
| `delta` | Number | 1 | 返回的页面数 |
| `extClass` | String | '' | 自定义类名 |

## 事件说明

| 事件名 | 说明 | 返回值 |
|--------|------|--------|
| `bind:back` | 返回按钮点击 | `{ delta: 1 }` |
| `bind:home` | 首页按钮点击 | - |
| `bind:search` | 搜索栏点击 | - |
| `bind:weather` | 天气点击 | - |
| `bind:logo` | Logo点击 | - |

## 插槽说明

| 插槽名 | 说明 |
|--------|------|
| `left` | 左侧自定义内容（当不显示back和home时） |
| `center` | 中间自定义内容（当不显示title和searchBar时） |
| `right` | 右侧自定义内容 |

## 使用示例

### 示例1：首页导航栏（带搜索、地址、天气）
```xml
<nav-bar 
  searchBar="{{true}}"
  showaw="{{true}}"
  showlogo="{{true}}"
  address="{{currentAddress}}"
  weather="{{weatherInfo}}"
  logoImage="/images/logo.png"
  background="rgba(255, 255, 255, 0.95)"
  bind:search="onSearch"
  bind:weather="onWeather"
  bind:logo="onLogo"
/>
```

### 示例2：详情页导航栏（返回+首页）
```xml
<nav-bar 
  title="详情"
  back="{{true}}"
  home="{{true}}"
  bind:back="onBack"
  bind:home="onHome"
/>
```

### 示例3：自定义导航栏
```xml
<nav-bar background="#667eea" color="#ffffff">
  <view slot="left">
    <text>自定义</text>
  </view>
  <view slot="center">
    <text>自定义标题</text>
  </view>
  <view slot="right">
    <text>更多</text>
  </view>
</nav-bar>
```

## 注意事项

1. **必须在 app.js 中初始化**：组件依赖 `getApp().globalSystemInfo`，确保 app.js 中有 `globalSystemInfo` 属性
2. **必须设置 navigationStyle: "custom"**：才能使用自定义导航栏
3. **自动适配**：组件会自动适配不同设备的状态栏高度和胶囊按钮位置
4. **固定定位**：导航栏使用固定定位，会自动生成占位元素
5. **图标主题**：`iconTheme` 设置为 'white' 时，图标会变成白色（适用于深色背景）

## 技术特点

- 自动获取系统信息（状态栏高度、胶囊按钮位置等）
- 支持iOS和Android不同适配
- 使用CSS变量实现动态样式
- 支持多插槽自定义
- 自动处理占位元素，避免内容被遮挡
