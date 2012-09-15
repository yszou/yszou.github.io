//用于服务器环境下的初始化函数

define([], function(){
  var init = function(ip, html){
    console.log(ip);
    console.log(html);
  }
  return init;
});
