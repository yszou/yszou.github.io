//用于服务器环境下的初始化函数

define(['dojo/dom-construct', 'dojo/query'], function(cstr, query){

  var init = function(ip, html){
    var iframe = cstr.create('iframe', {name: 'source', style: {display: 'none'}},
                             document.body, 'last');
    var form = '' + 
    '<form target="_self" method="post" action="http://' + ip + '/upload">' + 
    '  <div style="height: 30px; line-height: 30px;">' + 
    '    <label for="password" style="display: inline-block; width: 50px; text-align: right; font-size: 14px;">密码</label>' + 
    '    <input type="password" name="password" style="width: 150px; margin-left: 5px; border: 1px solid #008793" />' + 
    '  </div>' + 
    '  <div style="height: 30px; line-height: 30px; text-align: center;">' +
    '    <input type="hidden" name="data" value="' + encodeURIComponent(html) + '" />' +
    '    <input type="submit" value="提交" />' +
    '    <input type="reset" onclick="javascript: window.location.reload(true);" value="取消" />' +
    '  </div>' +
    '</form>' + '';

    var layer = cstr.create('div', {innerHTML: form,
                                    style: {  position: 'fixed'
                                            , backgroundColor: '#DBF7F9'
                                            , border: '1px solid #008793'
                                            , padding: '5px'
                                            , width: '240px'
                                            , height: '65px'
                                            , top: '20px'
                                            , left: screen.width / 2 - (240 / 2) + 'px'}},
                            document.body, 'last');
    query('form input[name="password"]', layer)[0].focus();
  }
  return init;
});
