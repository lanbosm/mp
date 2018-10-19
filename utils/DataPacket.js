export default (function(){

    const KEY_type= Symbol('_type');
    const KEY_content = Symbol('_content');
    class DataPacket{

       constructor(data){
         
         if(typeof data === "string"){
           Object.assign(this,JSON.parse(data));

         } else if (typeof data === "object"){
           Object.assign(this, data);
         }
        
       }
       set type(type){
         this[KEY_type]=type;
       }
      
       get type() {
         return this[KEY_type];
       }

       set content(content) {
         this[KEY_content] = content;
       }

       get content() {
         return this[KEY_content];
       }

       rawData(){
         return JSON.stringify({
           type:this.type,
           content: this.content
         })
       }
    }

    return DataPacket;

})();