//消息订阅
define(['dojo/_base/connect', 'dojo/dom-style', 'dojo/dom-construct',
        'dojo/_base/window', './canvas'],
  function(conn, style, cstr, win, create_canvas){
    var sub = function(frames, canvas){
      var curr = {canvas: canvas}

      //直接跳到指定页
      conn.subscribe('GOTO',
        function(i){
          if(i < 0 || i >= frames.length){return}
          frames.hide();
          frames.index = parseInt(i);
          frames.show();
          dojo.publish('_CHANGE');
        }
      );

      //跳到相对页
      conn.subscribe('MOVE',
        function(i){
          dojo.publish('GOTO', [frames.index + i]);
        }
      );

      //清除canvas
      conn.subscribe('CLEAR', curr,
        function(){
          cstr.destroy(this.canvas);
          this.canvas = create_canvas();
        }
      );

      //画线
      conn.subscribe('DRAW', curr,
        function(origin, path){
          var ctx = this.canvas.getContext('2d');
          ctx.moveTo(origin[0], origin[1]);
          for(var i = 0, l = path.length; i < l; i++){
            ctx.lineTo(path[i][0], path[i][1]);
            ctx.stroke();
          }
        }
      );

      //内部的页面变动消息
      conn.subscribe('_CHANGE',
        function(){
          if(!frames.num){return}
          for(var i = 0, l = frames.num.children.length; i < l; i++){
            style.set(frames.num.children[i], 'backgroundColor', 'white');
          }
          for(var i = 0; i <= frames.index; i++){
            style.set(frames.num.children[i], 'backgroundColor', '#FFA100');
          }
        }
      );

      //左下角列表
      conn.subscribe('NUM',
        function(m){
          if(m == null){
            if(frames.num){
              style.get(frames.num, 'display') == 'none' ? m = 1 : m = 0;
            } else {
              m = 1;
            }
          }
          if(m == 0){
            frames.num ? style.set(frames.num, 'display', 'none') : {};
            return;
          }
          if(frames.num){
            style.set(frames.num, 'display', 'block');
            return;
          }
          frames.num = cstr.create('ul',
                              {style: {
                                  position: 'fixed'
                                , left: '0'
                                , bottom: '0'
                                , margin: '0'
                                , zIndex: 20
                                , padding: '0'}},
                              win.body(), 'last');  

          for(var i = 0, l = frames.length; i < l; i++){
            cstr.create('li', {innerHTML: i + 1,
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
                        frames.num, 'last');
          }

          conn.connect(frames.num, 'onclick', function(eventObj){
            conn.publish('GOTO', [parseInt(eventObj.target.innerHTML) - 1]);
          });
          conn.publish('_CHANGE');
        }
      );

      conn.publish('GOTO', [0]);
      conn.publish('SUB_COMPLETE');
    }
    return sub;
  }
);



