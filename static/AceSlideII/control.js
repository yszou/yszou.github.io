//在有服务器端支持条件下的控制逻辑
define(['dojo/_base/connect', 'dojo/_base/json', 'dojo/_base/lang', 'dojo/_base/xhr'],
  function(connect, json, lang, xhr){
    var _ = window.location.href.split('/');
    var id = _[_.length - 1];
    var control = {
      is_control: false
    }


    //处理命令
    var do_cmd = function(cmd_list){
      for(var i = 0, l = cmd_list.length; i < l; i++){
        var s_list = cmd_list[i].split(' ');
        var func = ({
            'GOTO': function(s_list){connect.publish('GOTO', [s_list[1]])}
          , 'DRAW': function(s_list){connect.publish('DRAW',
                                     [json.fromJson(s_list[1]), json.fromJson(s_list[2])])}
          , 'CLEAR': function(s_list){connect.publish('CLEAR', [])}
        })[s_list[0]];
        func ? func(s_list) : {};
      }
    }

    //获取命令
    var pull = lang.hitch(
      control,
      function(sync){
        var that = this;
        if(that.is_control){return}
        xhr.post({
          url: '/pull',
          content: {id: id, sync: sync},
          handleAs: 'json',
          error: function(error, ioArgs){
            console.error('出错了, ' + error.message);
            return
          },
          load: function(response, ioArgs){
            if(response==null){return}
            if(response.result != 0){
              return alert('出错了, ' + response.msg);
            } else {
              if(that.is_control){return}
              var cmd_list = response.cmd_list;
              var sync = response.sync;
              pull(sync);
              do_cmd(cmd_list);
            }
          }
        });
      }
    );


    //推送命令
    var push = function(token, cmd){
      xhr.post({
        url: '/push',
        content: {cmd: cmd, token: token},
        handleAs: 'json',
        error: function(error, ioArgs){
          alert('出错了, ' + error.message);
          return
        },
        load: function(response, ioArgs){
          if(response.result != 0){
            return alert('出错了, ' + response.msg);
          } else {
            return;
          }
        }
      });
    }

    //请求控制token
    var apply_token = function(password, cb){
      xhr.post({
        url: '/push',
        content: {_method: 'apply', password: password, id: id},
        handleAs: 'json',
        error: function(error, ioArgs){
          alert('出错了, ' + error.message);
          return
        },
        load: function(response, ioArgs){
          if(response.result != 0){
            return alert('出错了, ' + response.msg);
          } else {
            cb(response.token);
          }
        }
      });
    }

    //申请控制token
    connect.subscribe('APPLY', control,
      function(){
        var that = this;
        if(that.is_control){return}

        var pass = prompt('请输入当前项目的密码');
        if(pass === undefined){return}

        apply_token(pass,
          function(token){
            that.is_control = true;

            connect.subscribe('GOTO',
              function(i){
                push(token, 'GOTO ' + i);
              }
            );

            connect.subscribe('DRAW',
              function(origin, path){
                push(token, 'DRAW ' + json.toJson(origin) + ' ' + json.toJson(path));
              }
            );

            connect.subscribe('CLEAR',
              function(origin, path){
                push(token, 'CLEAR');
              }
            );
          }
        );
      }
    );


    (function(){
      pull(-1);
    })();
  }
);
