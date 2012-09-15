//获取平台信息,在手机上添加控制按键
//判断浏览器是否支持触摸
define(['dojo/_base/connect', 'dojo/dom-construct', 'dojo/_base/window'],
  function(conn, cstr, win){
    var is_touch = 'createTouch' in dojo.doc;
    if(!is_touch){return}
    conn.subscribe('SUB_COMPLETE', function(){conn.publish('NUM', [1])});

    var node = cstr.create('button',
                            {innerHTML: '控制',
                             style:
                               {  fontSize: '20px'
                                , position: 'fixed'
                                , zIndex: 20
                                , left: '10px'
                                , top: '100px'
                               }
                             }, win.body(), 'last');

    conn.connect(node, 'onclick', function(){conn.publish('APPLY')});

    conn.connect(win.doc, 'ontouchstart',
      function(e){
        e = e.touches.item(0);
        var ox = e.clientX;

        var mover = conn.connect(win.doc, 'ontouchmove',
          function(e){
            e = e.touches.item(0);
            var dx = e.clientX - ox;
            if(dx > 100){conn.publish('MOVE', [-1])}
            if(dx < -100){conn.publish('MOVE', [1])}
          }
        );

        var upper = conn.connect(win.doc, 'ontouchend',
          function(eventObj){
            conn.disconnect(mover);
            conn.disconnect(upper);
          }
        );
      }
    );

    return;
  }
);

