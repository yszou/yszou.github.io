//切分页面
define(['dojo/dom-style', 'dojo/_base/window', 'dojo/query', 'dojo/dom-construct'],
  function(style, win, query, cstr){
    var frames = [];
    frames.width = null; //宽
    frames.height = null; //高
    frames.index = 0; //当前的页
    frames.num = null; //左下角的列表结点

    //隐藏所有页
    frames.hide = function(){
      for(var i = 0, l = frames[frames.index].length; i < l; i++){
        style.set(frames[frames.index][i], 'display', 'none');
      }
    }

    //显示当前页
    frames.show = function(){
      for(var i = 0, l = frames[frames.index].length; i < l; i++){
        var obj = frames[frames.index][i];
        style.set(obj, 'display', obj._o_display);
      }
    }

    //把body下的第一个节点分切,并隐藏全部结点
    //这是一个初始化方法
    var get_frames = function(width, height){
      var frame = [];

      //去掉注释
      query('dl').forEach(function(item){
        var node = item.children[0];
        if(node && node.tagName == 'DT' && node.innerHTML == '&gt;&gt;&gt;'){
          cstr.destroy(item);
        }
      });


      //最外层的那个div
      var wrapper = win.body().children[0];
      style.set(win.body(), 'backgroundImage', 'none');
      frames.width = width;
      frames.height = height;
      style.set(wrapper, {  width: width + 'px'
                          , height: height + 'px'
                          , margin: 'auto'});

      for(var i = 0, l = wrapper.children.length; i < l; i++){
        var node =  wrapper.children[i];
        node._o_display = style.get(node, 'display');
        style.set(node, 'display', 'none');

        if(node.tagName in {
            H1: true
          , HR: true
          , H2: true
          , H3: true
        }) {
          frames.push(frame);
          if(node.tagName != 'HR'){
            frame = [node];
          } else {
            frame = [];
          }
        } else {
          frame.push(node);
        }
      }

      frame.length > 0 ? frames.push(frame) : {};
      (frames.length > 0 && frames[0].length == 0) ? frames.shift() : {};

      return frames;
    }
    return get_frames;
  }
);






