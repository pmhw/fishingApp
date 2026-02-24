// pages/spot-detail/spot-detail.js
const MOCK_SPOTS = {
  1: {
    id: 1,
    name: '阳光钓场',
    distance: '2.5km',
    address: 'XX路123号',
    rating: 4.8,
    status: '营业中',
    seat: 9,
    seatTotal: 122,
    phone: '13800138000',
    latitude: 39.908823,
    longitude: 116.397470,
    openTime: '00:00-24:00',
    description: '钓场新开，新塘新水，鱼情爆躁，欢迎各位大师前来挑战。',
    facilities: ['停车场', 'WiFi', '卫生间', '餐饮服务', '渔具商店', '遮阳棚', '帐篷', '充电设施', '住宿', '淋浴设施'],
    images: ['/images/spot1.jpg', '/images/spot1.jpg'],
    ponds: [
      {
        id: 1,
        name: '混养塘',
        status: '开放中',
        area: '3亩',
        depth: '2.5M',
        type: '黑坑',
        rodLimit: '6.3',
        baitRule: '不限',
        seat: 7,
        seatTotal: 50,
        fishTypes: ['草鱼', '鲤鱼', '鲫鱼'],
        feeRules: [
          { name: '混养', price: '188元' },
          { name: '6小时博标', price: '200元' },
          { name: '6小时不博标', price: '170元' }
        ]
      }
    ],
    feeds: [
      {
        id: 1,
        pondName: '路亚塘',
        time: '2025-05-29 10:25',
        desc: '1500斤大口鲢'
      }
    ]
  }
}

Page({
  data: {
    spot: {},
    currentTab: 'realtime',
    currentRankTab: 'total',
    isFavorite: false
  },

  onLoad(options) {
    const id = Number(options.id || 1)
    const spot = MOCK_SPOTS[id] || MOCK_SPOTS[1]
    this.setData({ spot })
  },

  onTabChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ currentTab: key })
  },

  onRankTabChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ currentRankTab: key })
  },

  onToggleFavorite() {
    const next = !this.data.isFavorite
    this.setData({ isFavorite: next })
    wx.showToast({
      title: next ? '已收藏' : '已取消收藏',
      icon: 'none'
    })
  },

  onCallPhone() {
    const phone = this.data.spot.phone
    if (!phone) return
    wx.makePhoneCall({ phoneNumber: phone })
  },

  onNavigate() {
    const spot = this.data.spot
    if (!spot.latitude || !spot.longitude) return
    wx.openLocation({
      latitude: spot.latitude,
      longitude: spot.longitude,
      name: spot.name,
      address: spot.address
    })
  }
})

