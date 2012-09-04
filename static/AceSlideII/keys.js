//绑定按键
define(['dojo/_base/connect', 'dojo/_base/window'],
  function(conn, win){
    conn.connect(win.body(), 'keypress',
      function(eventObj){
        var fun = ({
            39: function(){conn.publish('MOVE', [1])} //RIGHT
          , 32: function(){conn.publish('MOVE', [1])} //SPACE
          , 37: function(){conn.publish('MOVE', [-1])} //LEFT
          , 8: function(){conn.publish('MOVE', [-1])} //BACK
          , 9: function(){eventObj.preventDefault(); conn.publish('NUM', [])} //TAB
          , 114: function(){conn.publish('CLEAR', [])} //R
          , 99: function(){conn.publish('APPLY', [])} //C
        })[eventObj.keyCode];
        fun ? fun() : {};
      }
    );
    return;
  }
);
