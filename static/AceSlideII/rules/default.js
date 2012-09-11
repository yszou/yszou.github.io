//默认规则,什么也不做
define([], function(){
  var rule = function(callback){
    callback();
  }
  return rule;
});
