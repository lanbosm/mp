//index.js
//获取应用实例
import DataMineType from '../../config/dataMineType.js'
import DataPacket from '../../utils/DataPacket.js'
import IMClientEventType from '../../utils/IMClientEventType.js'
import util from '../../utils/util.js'

const app = getApp();

Page({
  
  onReady: function () {
    console.log('ready');
  },
  //界面隐藏 程序未清除
  onShow: function () {
    
    let client = app.globalData.client;
  
    if(client.isOpened){
      this.connectOnOpened();
    }else{
      this.connectOnClosed();
    }
  },

  data: {
    hasUserInfo:false,
    message:"",
    sendMsgButtonTest: '连接中',
    sendImgButtonTest:'连接中',
    disbled:false,
    userInfo: {},
    hasUserInfo: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    console.log('load');
    //注册全局事件钩子
    util.registerGlobalEvent('userInfoReadyCallback', res => {
     
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    });

   
    let client = app.globalData.client;

    client.addEventListener(IMClientEventType.OPENED, this.connectOnOpened);      
    client.addEventListener(IMClientEventType.CLOSED, this.connectOnClosed);
   // client.removeEventListener(IMClientEventType.OPENED);
  
  },
  onUnload(){
    let client = app.globalData.client;

    client.removeEventListener(IMClientEventType.OPENED, this.connectOnOpened);
    client.removeEventListener(IMClientEventType.ClOSED, this.connectOnClosed);
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  upper: function (e) {
    console.log(e)
  },
  onShareAppMessage(){

  },
  onSendWallMessageTap(){
  
      if(this.data.message.length==0){
        wx.showToast({
          title: '不可以发空弹幕哦',
          icon:'none',
          duration:500
        })
        return false;
      }
      this.setData({ disbled:true})
      let client=app.globalData.client;
      let dataPacket = new DataPacket();
      dataPacket.type = DataMineType.TXT;
      dataPacket.content={
        txt:this.data.message,
        from:{
          "avatarUrl":app.globalData.userInfo.avatarUrl,
          "nickName": app.globalData.userInfo.nickName
        }
      }

      client.sendDataPacket(dataPacket).then(res=>{
          console.log('发送成功');
          wx.showToast({
            title: '发送成功',
            icon: 'none',
            duration: 500
          })
          this.setData({ disbled: false, message: "" })
      }).catch(err=>{
          wx.showToast({
            title: '呜~ 发送失败',
            icon: 'none',
            duration: 500
          })
          console.log('发送失败');
          this.setData({ disbled: false, message: "" })
      });

      
  },

  connectOnOpened(){

    this.setData({
      sendMsgButtonTest: '发消息',
      sendImgButtonTest: '发图片',
      disbled: false
    })
  },
  connectOnClosed() {
   
    this.setData({
      sendMsgButtonTest: '连接中',
      sendImgButtonTest: '连接中',
      disbled: true
    })
  },
  onMessageInputChanged(e){
      this.setData({ message:e.detail.value })
  }
})
