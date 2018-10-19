var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    toView: 'grren',
    scrollTop: 0
  },
  upper: function (e) {
   // console.log(e)
  },
  lower: function (e) {
     console.log(e)
  },
  scroll: function (e) {
  //  console.log(e)
  },
  tap: function (e) {
    console.log(this.data.toView);
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  sss:function(e){
    console.log('sss');
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  }
})