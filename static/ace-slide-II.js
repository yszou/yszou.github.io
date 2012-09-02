var frames = [];
frames.width = null; //宽
frames.height = null; //高
frames.index = 0; //当前的页
frames.num = null; //左下角的列表结点
frames.canvas = null; //画标记的层
frames.touch = null; //触摸的滑动翻页

//隐藏所有页
frames.hide = dojo.hitch({frames: frames},
  function(){
    dojo.forEach(this.frames[this.frames.index], function(node){
      dojo.style(node, 'display', 'none');
    });
  }
);

//显示当前页
frames.show = dojo.hitch({frames: frames},
  function(){
    dojo.forEach(this.frames[this.frames.index], function(node){
      dojo.style(node, 'display', node._o_display);
    });
  }
);


//把body下的第一个节点分切,并隐藏全部结点
//这是一个初始化方法
var split_body = dojo.hitch({frames: frames},
  function(width, height){
    var frame = [];
    var that = this;

    //最外层的那个div
    var wrapper = dojo.body().children[0];
    dojo.style(dojo.body(), 'backgroundImage', 'none');
    that.frames.width = width;
    that.frames.height = height;
    dojo.style(wrapper, 'width', width + 'px');
    dojo.style(wrapper, 'height', height + 'px');

    dojo.forEach(wrapper.children, function(node){

      node._o_display = dojo.style(node, 'display');
      dojo.style(node, 'display', 'none');

      if(node.tagName in {
          H1: true
        , HR: true
        , H2: true
        , H3: true
      }) {
        that.frames.push(frame);
        if(node.tagName != 'HR'){
          frame = [node];
        } else {
          frame = [];
        }
      } else {
        node.tagName != 'HR' ? frame.push(node) : {};
      }
    });
    frame.length > 0 ? that.frames.push(frame) : {};
    that.frames[0].length == 0 ? frames.shift() : {};

    that.frames.canvas = create_canvas(width, height);
    do_mobile();

    dojo.publish('GOTO', [0]);
  }
);


//创建canvas层
//http://www.cnblogs.com/eric6/archive/2011/07/26/2116893.html
//位置相关的值,根据chrome缩放%150进行调节
var create_canvas = function(width, height){
  var node = dojo.create('canvas', {width: width + 75,
                                    height: height + 60,
                                    style: {
                                        border: 'none'
                                      , position: 'fixed'
                                      , zIndex: 10
                                      , left: (screen.width - width) / 100 + 'px'
                                    }
                                   }, dojo.body(), 'first');

  //node.onselectstart = function(){return false}
  dojo.doc.onselectstart = function(){return false}
  var ctx = node.getContext('2d');
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  var box = node.getBoundingClientRect();

  dojo.connect(node, 'onmousedown',
    function(e){
      var path = [];
      var x = e.clientX - box.left;
      var y = e.clientY - box.top;
      var origin = [x, y];
      ctx.moveTo(x, y);

      var mover = dojo.connect(dojo.doc, 'onmousemove',
        function(e){
          var x = e.clientX - box.left;
          var y = e.clientY - box.top;
          path.push([x, y]);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      );

      var upper = dojo.connect(dojo.doc, 'onmouseup',
        function(eventObj){
          dojo.publish('DRAW', [origin, path]);
          dojo.disconnect(mover);
          dojo.disconnect(upper);
        }
      );
    }
  );
  return node;
}


//获取平台信息,在手机上添加控制按键
//判断浏览器是否支持触摸
var do_mobile = function(){
  var is_touch = 'createTouch' in dojo.doc;
  if(!is_touch){return}
  dojo.publish('NUM', [1]);

  var node = dojo.create('button', {innerHTML: '控制',
                                 style: {
                                      fontSize: '20px'
                                    , position: 'fixed'
                                    , zIndex: 20
                                    , left: '10px'
                                    , top: '100px'
                                 }}, dojo.body(), 'last');

  dojo.connect(node, 'onclick', function(){dojo.publish('APPLY')});

  dojo.connect(dojo.doc, 'ontouchstart',
    function(e){
      e = e.touches.item(0);
      var ox = e.clientX;

      var mover = dojo.connect(dojo.doc, 'ontouchmove',
        function(e){
          e = e.touches.item(0);
          var dx = e.clientX - ox;
          if(dx > 100){dojo.publish('MOVE', [-1])}
          if(dx < -100){dojo.publish('MOVE', [1])}
        }
      );

      var upper = dojo.connect(dojo.doc, 'ontouchend',
        function(eventObj){
          dojo.disconnect(mover);
          dojo.disconnect(upper);
        }
      );
    }
  );

  return;
}


//直接跳到指定页
dojo.subscribe('GOTO', {frames: frames},
  function(i){
    if(i < 0 || i >= this.frames.length){return}
    this.frames.hide();
    this.frames.index = parseInt(i);
    this.frames.show();
    dojo.publish('_CHANGE');
  }
);

//跳到相对页
dojo.subscribe('MOVE', {frames: frames},
  function(i){
    dojo.publish('GOTO', [this.frames.index + i]);
  }
);

//清除canvas
dojo.subscribe('CLEAR', {frames: frames},
  function(){
    dojo.destroy(this.frames.canvas);
    this.frames.canvas = create_canvas(this.frames.width, this.frames.height);
  }
);


//画线
dojo.subscribe('DRAW', {frames: frames},
  function(origin, path){
    var ctx = this.frames.canvas.getContext('2d');
    ctx.moveTo(origin[0], origin[1]);
    for(var i = 0, l = path.length; i < l; i++){
      ctx.lineTo(path[i][0], path[i][1]);
      ctx.stroke();
    }
  }
);


//内部的页面变动消息
dojo.subscribe('_CHANGE', {frames: frames},
  function(){
    if(!this.frames.num){return}
    dojo.forEach(this.frames.num.children, function(node){
      dojo.style(node, 'backgroundColor', 'white');
    });
    for(var i = 0; i <= this.frames.index; i++){
      dojo.style(this.frames.num.children[i], 'backgroundColor', '#FFA100');
    }
  }
);


//左下角列表
dojo.subscribe('NUM', {frames: frames},
  function(i){
    if(i == null){
      if(this.frames.num){
        dojo.style(this.frames.num, 'display') == 'none' ? i = 1 : i = 0;
      } else {
        i = 1;
      }
    }
    if(i == 0){
      this.frames.num ? dojo.style(this.frames.num, 'display', 'none') : {};
      return;
    }
    if(this.frames.num){
      dojo.style(this.frames.num, 'display', 'block');
      return;
    }
    this.frames.num = dojo.create('ul',
                        {style: {
                            position: 'fixed'
                          , left: '0'
                          , bottom: '0'
                          , margin: '0'
                          , zIndex: 20
                          , padding: '0'}},
                        dojo.body(), 'last');  

    for(var i = 0, l = this.frames.length; i < l; i++){
      dojo.create('li', {innerHTML: i + 1,
                         style: {
                            listStyle: 'none'
                          , fontSize: '6px'
                          , border: '1px solid black'
                          , float: 'left'
                          , 'padding': '0' 
                          , backgroundColor: 'white'
                          , display: 'inline-block'
                          , width: '11px'
                          , textAlign: 'center'
                          , marginLeft: '-1px'
                          , cursor: 'pointer'
                         }},
                  this.frames.num, 'last');
    }

    dojo.connect(this.frames.num, 'onclick', function(eventObj){
      dojo.publish('GOTO', [parseInt(eventObj.target.innerHTML) - 1]);
    });
    dojo.publish('_CHANGE');
  }
);



//绑定按键
dojo.addOnLoad(function(){
  (function(){
    dojo.connect(dojo.body(), 'keypress',
      function(eventObj){
        var fun = ({
            39: function(){dojo.publish('MOVE', [1])} //RIGHT
          , 32: function(){dojo.publish('MOVE', [1])} //SPACE
          , 37: function(){dojo.publish('MOVE', [-1])} //LEFT
          , 8: function(){dojo.publish('MOVE', [-1])} //BACK
          , 9: function(){eventObj.preventDefault();; dojo.publish('NUM', [])} //TAB
          , 114: function(){dojo.publish('CLEAR', [])} //R
          , 99: function(){dojo.publish('APPLY', [])} //C
        })[eventObj.keyCode];
        fun ? fun() : {};
      }
    );
  })();
});


dojo.addOnLoad(function(){
  split_body(600, 450);
});
