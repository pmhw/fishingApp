// pages/shop/shop.js
const app = getApp()

Page({
  data: {
    // 购物车抽屉
    showCartDrawer: false,
    cartList: [],
    cartCount: 0,

    // 左侧分类列表
    categoryList: [
      { id: 1, name: '推荐' },
      { id: 2, name: '鱼竿' },
      { id: 3, name: '鱼线' },
      { id: 4, name: '鱼饵' },
      { id: 5, name: '浮漂' },
      { id: 6, name: '钓箱/椅' },
      { id: 7, name: '配件' }
    ],

    // 商品列表（按分类归属）
    productList: [
      {
        id: 101,
        categoryId: 1,
        name: '新手入门鱼竿套装',
        desc: '包含鱼竿+鱼线+鱼钩，一套即用',
        price: 299,
        tag: '推荐',
        image: '/images/shop1.jpg'
      },
      {
        id: 102,
        categoryId: 1,
        name: '竞技级浮漂套装',
        desc: '高灵敏度，适合黑坑竞技',
        price: 89,
        tag: '热卖',
        image: '/images/shop4.jpg'
      },
      {
        id: 201,
        categoryId: 2,
        name: '碳素鲤鱼竿 4.5m',
        desc: '轻量高碳，手感舒适',
        price: 399,
        tag: '新品',
        image: '/images/shop1.jpg'
      },
      {
        id: 202,
        categoryId: 2,
        name: '路亚杆套装',
        desc: '适合路亚新手，性价比之选',
        price: 268,
        tag: '路亚',
        image: '/images/shop2.jpg'
      },
      {
        id: 301,
        categoryId: 3,
        name: '高强度尼龙线 100m',
        desc: '耐磨抗拉，不易打结',
        price: 39,
        tag: '必备',
        image: '/images/shop5.jpg'
      },
      {
        id: 401,
        categoryId: 4,
        name: '综合型鱼饵组合',
        desc: '多种口味适配不同水域',
        price: 59,
        tag: '实用',
        image: '/images/shop2.jpg'
      },
      {
        id: 501,
        categoryId: 5,
        name: '纳米浮漂 3只装',
        desc: '吃铅小，信号清晰',
        price: 79,
        tag: '灵敏',
        image: '/images/shop4.jpg'
      },
      {
        id: 601,
        categoryId: 6,
        name: '多功能钓箱 36L',
        desc: '带靠背+脚踏，舒适久坐',
        price: 489,
        tag: '舒适',
        image: '/images/shop3.jpg'
      },
      {
        id: 701,
        categoryId: 7,
        name: '不锈钢鱼护 3m',
        desc: '结实耐用，收纳方便',
        price: 99,
        tag: '配件',
        image: '/images/shop6.jpg'
      }
    ],

    // 当前选中分类
    currentCategoryId: 1,

    // 当前展示的商品（右侧）
    displayProducts: []
  },

  onLoad() {
    this.initDisplayProducts()
  },

  onShow() {
    this.syncCart()
  },

  /** 从全局购物车同步到页面（不同规格单独一行，每行唯一 key） */
  syncCart() {
    const cart = (app.globalData && app.globalData.cart) || []
    const cartList = cart.map((item, i) => ({ ...item, _key: `${item.id}_${item.spec || ''}_${i}` }))
    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    this.setData({ cartList, cartCount })
  },

  /** 打开购物车抽屉 */
  onOpenCart() {
    this.syncCart()
    this.setData({ showCartDrawer: true })
  },

  /** 关闭购物车抽屉 */
  onCloseCart() {
    this.setData({ showCartDrawer: false })
  },

  /** 从购物车删除一项（按索引） */
  onRemoveCartItem(e) {
    const index = e.currentTarget.dataset.index
    const cart = (app.globalData.cart || []).slice()
    if (index < 0 || index >= cart.length) return
    cart.splice(index, 1)
    app.globalData.cart = cart
    this.syncCart()
    wx.showToast({ title: '已移除', icon: 'none' })
  },

  /** 商城列表内加购（点击商品卡加购时可用） */
  addToCart(product, quantity = 1) {
    if (!app.globalData.cart) app.globalData.cart = []
    const cart = app.globalData.cart
    const spec = ''
    const item = cart.find(i => i.id === product.id && (i.spec || '') === spec)
    if (item) {
      item.quantity = (item.quantity || 1) + quantity
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        quantity,
        spec: ''
      })
    }
    this.syncCart()
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  },

  // 初始化右侧商品展示
  initDisplayProducts() {
    const { currentCategoryId } = this.data
    this.filterProductsByCategory(currentCategoryId)
  },

  // 根据分类筛选商品
  filterProductsByCategory(categoryId) {
    const displayProducts = this.data.productList.filter(
      item => item.categoryId === categoryId || categoryId === 1 && item.categoryId === 1
    )
    this.setData({
      currentCategoryId: categoryId,
      displayProducts
    })
  },

  // 点击左侧分类
  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id
    this.filterProductsByCategory(categoryId)
  },

  // 点击商品：跳转详情
  onProductTap(e) {
    const product = e.currentTarget.dataset.product
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${product.id}`
    })
  },

  // 商品卡上加购（阻止冒泡时用）
  onAddCartTap(e) {
    e.stopPropagation && e.stopPropagation()
    const product = e.currentTarget.dataset.product
    this.addToCart(product, 1)
  }
})

