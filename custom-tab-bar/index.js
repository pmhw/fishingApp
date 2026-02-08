// custom-tab-bar/index.js
const app = getApp()

Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#667eea",
    list: [
      {
        pagePath: "/pages/home/home",
        iconPath: "/images/tabbar/home.png",
        selectedIconPath: "/images/tabbar/home-active.png",
        text: "首页"
      },
      {
        pagePath: "/pages/nearby/nearby",
        iconPath: "/images/tabbar/nearby.png",
        selectedIconPath: "/images/tabbar/nearby-active.png",
        text: "附近钓场"
      },
      {
        pagePath: "/pages/member-code/member-code",
        iconPath: "/images/tabbar/member.png",
        selectedIconPath: "/images/tabbar/member-active.png",
        text: "会员码"
      },
      {
        pagePath: "/pages/records/records",
        iconPath: "/images/tabbar/records.png",
        selectedIconPath: "/images/tabbar/records-active.png",
        text: "垂钓记录"
      },
      {
        pagePath: "/pages/profile/profile",
        iconPath: "/images/tabbar/profile.png",
        selectedIconPath: "/images/tabbar/profile-active.png",
        text: "个人中心"
      }
    ]
  },
  lifetimes: {
    attached() {
      this.setSelected()
    },
    show() {
      this.setSelected()
    }
  },
  pageLifetimes: {
    show() {
      this.setSelected()
    }
  },
  methods: {
    setSelected() {
      const pages = getCurrentPages()
      if (pages.length === 0) return
      const currentPage = pages[pages.length - 1]
      const url = currentPage.route
      const selected = this.data.list.findIndex(item => {
        return item.pagePath === '/' + url
      })
      if (selected >= 0 && selected !== this.data.selected) {
        this.setData({
          selected: selected
        })
      }
    },
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      const index = data.index
      
      this.setData({
        selected: index
      })
      
      wx.switchTab({
        url,
        success: () => {
          this.setSelected()
        }
      })
    }
  }
})
