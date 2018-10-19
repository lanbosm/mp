//app.js

import AppConfig from 'config/index.js'
import IMClient from 'utils/IMClient.js'


App({
  onLaunch: function () {
      
    this.login();

    let client= new IMClient();
    
    client.connect(AppConfig.WEBSOCKET_URL);
  
    this.globalData.client = client;
  
  },
  globalData: {
    hasUserInfo:false,
    userInfo: null,
    client:null
  },
  login(){
    wx.showLoading({
      title: '获取用户信息中',
    })
    this.authcheckSetting()
      .then(_=>{
        return this.getUserInfo();
      })
      .then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '获取成功'
        })
      })
      .catch(err => {
        console.log(err);
        wx.hideLoading();
        wx.showModal({
          title: '温馨提示',
          showCancel:false,
          content:err,
          confirmText:"重新获取",
          success:res=>{
            this.login();
          }
        })
      })
  },
  authcheckSetting(){  
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
           // 已经授权，直接放行
          if (res.authSetting['scope.userInfo']) {
            resolve();
          }else{
            if (res.authSetting['scope.userInfo']===false){ //授权已存在 但拒绝
               // 弹出选授权设置页面 选择开关放行
                wx.openSetting({
                  success: res => {
                    if (res.authSetting['scope.userInfo']===true) resolve();
                    else reject("请设置用户信息授权权限");
                  }
                })
            }else{ //发起授权
              wx.authorize({
                scope: 'scope.userInfo',
                success(res) {
                  resolve();
                },
                fail(err) {
                  reject("请允许信息授权");
                }
              })
            }
          }
        },
        fail:err=>{
          reject("获取授权设置失败")
        }
      })
    })
  },
  getUserInfo(){
        return new Promise((resolve,reject)=>{
          wx.getUserInfo({
            success: res=> {
              this.globalData.hasUserInfo=true;
              this.globalData.userInfo = res.userInfo;
              setTimeout(_=>{
                //通知page页面的事件回调
                if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res)
                }
                resolve();
              },500); //500是为了page页面的load事件
            },
            fail:err=>{ 
              reject("获取信息失败");
            }
          })

        })

  },
  welcomOnReceived(datapacket){
      wx.showToast({
        title: datapacket.content,
      })
  }
})