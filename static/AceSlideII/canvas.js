//创建canvas层
//http://www.cnblogs.com/eric6/archive/2011/07/26/2116893.html
//位置相关的值,根据chrome缩放%150进行调节
define(['dojo/dom-construct', 'dojo/_base/window', 'dojo/_base/connect'],
  function(cstr, win, conn){
    var canvas = function(){
      var node = cstr.create('canvas', 
                              {  width: screen.width
                               , height: screen.height
                               , style:
                                 {  border: 'none'
                                  , position: 'fixed'
                                  , zIndex: 10
                                 }}, win.body(), 'first');

      //node.onselectstart = function(){return false}
      win.doc.onselectstart = function(){return false}

      var ctx = node.getContext('2d');
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 1;
      var box = node.getBoundingClientRect();

      conn.connect(node, 'onmousedown',
        function(e){
          var path = [];
          var x = e.clientX - box.left;
          var y = e.clientY - box.top;
          var origin = [x, y];
          ctx.moveTo(x, y);

          var mover = conn.connect(win.doc, 'onmousemove',
            function(e){
              var x = e.clientX - box.left;
              var y = e.clientY - box.top;
              path.push([x, y]);
              ctx.lineTo(x, y);
              ctx.stroke();
            }
          );

          var upper = conn.connect(win.doc, 'onmouseup',
            function(eventObj){
              conn.publish('DRAW', [origin, path]);
              conn.disconnect(mover);
              conn.disconnect(upper);
            }
          );
        }
      );
      return node;
    }
    return canvas;
  }
);
