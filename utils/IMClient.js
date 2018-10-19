/**
 * 通讯类 
 * 注：小程序开发工具为了支持aynsc await 必须引入额外的库 或者用wepy工具
 */

import regeneratorRuntime from '../lib/regenerator-runtime/runtime-module.js' 
import IMClientEventType from './IMClientEventType.js'
import DataPacket from './DataPacket.js'


/**
 * 定义私有的变量名称
 */
const KEY_event_handlers = Symbol("_event_handlers");
const KEY_emitEvent = Symbol("_emitEvent");

//消息队列
const KEY_dataPacketQueue = Symbol("_dataPacketQueue");
const KEY_clearDataPacketQueue = Symbol("_clearDataPacketQueue");

//自动重连
const KEY_autoConnect = Symbol("_autoConnect");

//是否已打开
const KEY_isOpened = Symbol("_isOpened");

//当前url
const KEY_url = Symbol("_url");

//socket的钩子
const KEY_onOpen = Symbol("_onOpen");
const KEY_onClose = Symbol("_onClose");
const KEY_onError = Symbol("_onError");
const KEY_onMessage = Symbol("_onMessage");
const KEY_sendMessage = Symbol("_sendMessage");


class IMClient{

  
    constructor(){

      //私有属性
      this[KEY_event_handlers] = {};

      this[KEY_dataPacketQueue] =[];

      this[KEY_isOpened]=false;

      this[KEY_autoConnect]=true;
      
    }
   
    //私有方法
    [KEY_onOpen](){
      this[KEY_isOpened] = true;
      this[KEY_clearDataPacketQueue]();
      this[KEY_emitEvent](IMClientEventType.OPENED);
      console.log('连接成功');
    }
    [KEY_onClose]() {
    
      this[KEY_isOpened] = false;
      this[KEY_emitEvent](IMClientEventType.CLOSED);
      console.log('close');
      //5秒后自动重连
      if(this[KEY_autoConnect]){
          setTimeout(_=>{
            this.connect(this[KEY_url]);
          },5000)
      }
      console.log('连接关闭');
    }

    [KEY_onError](error) {
      console.log('连接出错');
      console.log(error);
    }

    [KEY_onMessage](data) {
    
      let dataPacket = new DataPacket(data);
      this[KEY_emitEvent](dataPacket.type, dataPacket);
    }

     [KEY_sendMessage](rawData) {
     
        return  new Promise((resolve, reject) => { 
            wx.sendSocketMessage({
              data: rawData,
              success:res=>{
               resolve(res);
              },
              fail:err=>{
                reject(err);
              }
            })
        })
     

    }

    /**
     * 需要一个内部私有函数去执行事件
     */
    [KEY_emitEvent](eventType,...args){
     
     
      //有事件
      if (this[KEY_event_handlers][eventType] && this[KEY_event_handlers][eventType].length>0){
      
        let handlers = this[KEY_event_handlers][eventType];
        for(let i=0; i<handlers.length; i++){
            handlers[i].call(this,...args);
        }

      }
    }

    //清空队列
    [KEY_clearDataPacketQueue](){
        let datapackets= this[KEY_dataPacketQueue];
        this[KEY_dataPacketQueue]=[];
        datapackets.forEach(datapacket=>{
          this.sendDataPacket(datapacket);
        })

    }



    /**
     * 连接
     */
    //共有属性
    get isOpened() {
      return this[KEY_isOpened];
    }
    //共有方法
    connect(url){
        
        this[KEY_url]=url;

        wx.onSocketOpen(this[KEY_onOpen].bind(this));
        wx.onSocketClose(this[KEY_onClose].bind(this));
        wx.onSocketError(this[KEY_onError].bind(this));
        wx.onSocketMessage(res=>{
          this[KEY_onMessage](res.data);
        });

        wx.connectSocket({
          url:url,
        })
    }
    

    /**
     * 发数据
     */
    async sendDataPacket(dataPacket) {
        var res= await this[KEY_sendMessage](dataPacket.rawData());
       
        return res;
    }


    /**
   * 事件驱动
   */
    addEventListener(t,handler) {
     
    
      if(!this[KEY_event_handlers][t]){
        this[KEY_event_handlers][t] =[handler];
      }else{
        this[KEY_event_handlers][t].push(handler);
      }
  
    
      this[KEY_emitEvent](t);
    }

    removeEventListener(t) {

      if (this[KEY_event_handlers][t]) {
            this[KEY_event_handlers][t].splice(0,1);
            if (this[KEY_event_handlers][t].length==0){
              delete this[KEY_event_handlers][t];
            }
      }
    }

}


export default (function(){
  return IMClient;
})()