//WebQQ添加群聊里的引用
define(['dojo/_base/window', 'dojo/on', 'dojo/query', 'dojo/dom-construct', 'dojo/dom-attr', 'dojo/keys'],
  function(win, on, query, cstr, attr, keys){
    var rule = function(callback){
      var opened = {};

      on(win.doc, 'dl.chatBox_buddyMsg:click',
        function(eventObj){
          var duin = attr.get(this, 'duin');
          if(opened.duin){return}
          else{opened.duin=true}

          var area = this.parentNode.parentNode.parentNode;
          var name_date = query('dt.msgHead span', this);
          var name = name_date[0].innerHTML;
          var date = name_date[1].innerHTML;
          var body = query('dd', this)[0].innerHTML.replace(/^\s*/, '').replace(/\s*$/, '');

          var textarea = cstr.create('textarea', {rows: 5, style: {width: '240px', marginLeft: '10px'}}, this, 'after');
          var send = cstr.create('a', {"class": 'chatBox_closeButton', innerHTML: '发送'}, this, 'after');
          var cancel = cstr.create('a', {"class": 'chatBox_closeButton', innerHTML: '取消'}, this, 'after');

          on(textarea, 'keydown', function(eventObj){
            if(eventObj.keyCode == keys.ENTER && eventObj.ctrlKey){
              on.emit(send, 'click', {bubbles: true, cancelable: true});
            }
            eventObj.stopPropagation()
          });
          on(cancel, 'click', function(eventObj){
            cstr.destroy(textarea);
            cstr.destroy(send);
            cstr.destroy(cancel);
            opened.duin = false;
          });
          on(send, 'click', function(eventObj){
            console.log(body);
            console.log(body.replace(/<br>*$/, ''));
            var s_body = body.replace(/<br>*$/, '').split('<br>');
            console.log(s_body);
            for(var i = 0, l = s_body.length; i < l; i++){
              s_body[i] = '　　| ' + s_body[i]; 
            }
            var p_body = s_body.join('<br />');

            var btn = query('a.chatBox_sendMsgButton', area)[0];
            var s = '【回复：' + name + ' ' + date + '】<br />';
            s += p_body + '<br />';
            s += '------------------------------------------' + '<br />';
            s += textarea.value.replace(/\n/g, '<br />');
            query('div.rich_editor_div', area)[0].innerHTML = s;
            on.emit(btn, 'click', {bubbles: true, cancelable: true});
            on.emit(cancel, 'click', {bubbles: true, cancelable: true});
          });

          textarea.innerHTML = '';
          textarea.focus();
        }
      );
      callback();
    }
    return rule;
  }
);
