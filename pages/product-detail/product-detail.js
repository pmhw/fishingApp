// pages/product-detail/product-detail.js
Page({
  data: {
    productId: null,
    product: {
      id: 1,
      name: '新手入门鱼竿套装',
      subtitle: '包含鱼竿+鱼线+鱼钩，一套即用',
      price: 299,
      originalPrice: 399,
      images: ['/images/shop1.jpg', '/images/shop1.jpg', '/images/shop1.jpg'],
      tags: ['推荐', '热卖', '包邮'],
      description: '这是一款专为新手设计的鱼竿套装，包含：\n\n1. 碳素鱼竿 4.5m\n2. 高强度鱼线 100m\n3. 鱼钩套装（多种规格）\n4. 浮漂 3只\n5. 鱼护网\n\n特点：\n- 轻量高碳材质，手感舒适\n- 适合淡水垂钓\n- 性价比高，适合入门\n- 全套装备，开箱即用',
      specs: [
        {
          name: '规格',
          options: ['标准版', '豪华版', '旗舰版']
        },
        {
          name: '颜色',
          options: ['黑色', '蓝色', '绿色']
        }
      ]
    },
    selectedSpecs: {},
    selectedSpec: '',
    quantity: 1,
    showSpecModal: false
  },

  onLoad(options) {
    const productId = options.id || options.productId
    if (productId) {
      this.setData({ productId })
      this.loadProductDetail(productId)
    } else {
      // 如果没有传入ID，使用默认数据
      this.initDefaultProduct()
    }
  },

  // 加载商品详情
  loadProductDetail(productId) {
    // 这里可以调用API获取商品详情
    // wx.request({
    //   url: 'https://api.example.com/product/' + productId,
    //   success: (res) => {
    //     this.setData({ product: res.data })
    //   }
    // })
    
    // 暂时使用模拟数据
    console.log('加载商品详情:', productId)
    this.initDefaultProduct()
  },

  // 初始化默认商品数据
  initDefaultProduct() {
    // 可以根据productId设置不同的商品数据
    const products = {
      101: {
        id: 101,
        name: '新手入门鱼竿套装',
        subtitle: '包含鱼竿+鱼线+鱼钩，一套即用',
        price: 299,
        originalPrice: 399,
        images: ['/images/shop1.jpg'],
        tags: ['推荐', '热卖'],
        description: '专为新手设计的鱼竿套装...'
      },
      102: {
        id: 102,
        name: '竞技级浮漂套装',
        subtitle: '高灵敏度，适合黑坑竞技',
        price: 89,
        images: ['/images/shop4.jpg'],
        tags: ['热卖'],
        description: '高灵敏度浮漂套装...'
      }
    }
    
    const productId = this.data.productId || 101
    const product = products[productId] || this.data.product
    
    // 如果没有规格，设置默认规格
    if (!product.specs) {
      product.specs = [
        {
          name: '规格',
          options: ['标准版', '豪华版']
        }
      ]
    }
    
    this.setData({ product })
  },

  // 打开规格选择弹窗
  onSpecTap() {
    this.setData({ showSpecModal: true })
  },

  // 关闭规格选择弹窗
  onSpecModalClose() {
    this.setData({ showSpecModal: false })
  },

  // 选择规格
  onSpecSelect(e) {
    const group = e.currentTarget.dataset.group
    const value = e.currentTarget.dataset.value
    const selectedSpecs = { ...this.data.selectedSpecs }
    selectedSpecs[group] = value
    this.setData({ selectedSpecs })
  },

  // 确认规格选择
  onSpecConfirm() {
    const { selectedSpecs, product } = this.data
    const specValues = Object.values(selectedSpecs)
    
    if (specValues.length !== product.specs.length) {
      wx.showToast({
        title: '请选择完整规格',
        icon: 'none'
      })
      return
    }
    
    const selectedSpec = specValues.join(' / ')
    this.setData({
      selectedSpec,
      showSpecModal: false
    })
  },

  // 数量变化
  onQuantityChange(e) {
    const type = e.currentTarget.dataset.type
    let quantity = this.data.quantity
    
    if (type === 'plus') {
      quantity += 1
      if (quantity > 99) {
        wx.showToast({
          title: '最多购买99件',
          icon: 'none'
        })
        return
      }
    } else if (type === 'minus') {
      quantity -= 1
      if (quantity < 1) {
        quantity = 1
      }
    }
    
    this.setData({ quantity })
  },

  // 数量输入
  onQuantityInput(e) {
    let quantity = parseInt(e.detail.value) || 1
    if (quantity < 1) quantity = 1
    if (quantity > 99) {
      quantity = 99
      wx.showToast({
        title: '最多购买99件',
        icon: 'none'
      })
    }
    this.setData({ quantity })
  },

  // 联系客服
  onContact() {
    wx.showToast({
      title: '联系客服',
      icon: 'none'
    })
    // 这里可以打开客服聊天窗口
  },

  // 加入购物车
  onAddToCart() {
    const { product, selectedSpec, quantity } = this.data
    
    if (!selectedSpec && product.specs && product.specs.length > 0) {
      wx.showToast({
        title: '请选择规格',
        icon: 'none'
      })
      this.onSpecTap()
      return
    }
    
    wx.showToast({
      title: `已加入购物车 x${quantity}`,
      icon: 'success'
    })
    
    // 这里可以调用API添加到购物车
    // wx.request({
    //   url: 'https://api.example.com/cart/add',
    //   method: 'POST',
    //   data: {
    //     productId: product.id,
    //     spec: selectedSpec,
    //     quantity: quantity
    //   }
    // })
  },

  // 立即购买
  onBuyNow() {
    const { product, selectedSpec, quantity } = this.data
    
    if (!selectedSpec && product.specs && product.specs.length > 0) {
      wx.showToast({
        title: '请选择规格',
        icon: 'none'
      })
      this.onSpecModalClose()
      this.onSpecTap()
      return
    }
    
    wx.showToast({
      title: '跳转到订单页面',
      icon: 'none'
    })
    
    // 这里可以跳转到订单确认页面
    // wx.navigateTo({
    //   url: `/pages/order-confirm/order-confirm?productId=${product.id}&spec=${selectedSpec}&quantity=${quantity}`
    // })
  }
})
