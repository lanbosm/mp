//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    limit: 10,//显示数据量,
    list: [1,2,3,4,5,6,7,8,9,10],
    page: 1,//当前页
    load: false,
    loading: false,//加载动画的显示,
    count:22,
    list_data: [],
    title: "正在加载数据...",
    isHideLoadMore:false
  },
  onLoad: function () {
    var that = this
    that.setData({
      list_data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this
    //模拟加载
    this.setData({
      load: true,
      page:1
    })
    setTimeout(function () {
      // complete

   
        that.setData({
          load:false,
          list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        })
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onReachBottom: function () {
    var that = this;
      console.log(3333)
    if (!this.data.load) {//全局标志位，方式请求未响应是多次触发
      if (this.data.list.length < that.data.count){
          this.setData({
            load: true,
            loading:true
          })

        setTimeout(() => {
          var newData =[];
          for(let i=0; i<10;i++){
               newData.push(i+10*this.data.page); 
          }

          var content = that.data.list.concat(newData)//将放回结果放入content

          
          this.setData({
            list: content,
            page: this.data.page * 1 + 1,
            load:false,
            loading:false
          })
        }, 1000)
        }

    }
    console.log('加载更多')
  

    
  
  }
})
