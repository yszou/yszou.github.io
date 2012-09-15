//163邮箱
define(['dojo/dom', 'dojo/query', 'dojo/dom-construct', 'dojo/_base/window'],
  function(dom, query, cstr, win){

    var parse_contact = function(){
      var wrapper = dom.byId('addrGroup_zall_ul', document.index.document);
      var users = [];
      query('li', wrapper).forEach(function(item){
        var mbox = item.children[0].children[0].innerHTML;
        var name = item.children[2].children[0].children[0].children[0].innerHTML;
        users.push([name, mbox]);
      });
      cstr.empty(win.body());
      cstr.create('div', {}, win.body(), 'first');
      return users;
    }

    var to_sohu = function(user){
      var name = user[0];
      var mbox = user[1];
      var iframe = cstr.create('iframe', {name: mbox, style: {display: 'none'}}, win.body(), 'last');
      var form = cstr.create('form', {  method: 'post'
                                      , target: mbox
                                      , action: 'http://mail.sohu.net/address/modContact'
                                      , style: {display: 'none'}}, win.body(), 'last');
      form.innerHTML += '<input type="hidden" name="type" value="4" />';
      form.innerHTML += '<input type="hidden" name="birthday" value="--" />';
      form.innerHTML += '<input type="hidden" name="nickname" value="' + name + '" />';
      form.innerHTML += '<input type="hidden" name="personalemail" value="' + mbox + '" />';
      form.submit();
      cstr.create('p', {innerHTML: name + ' >> ' + mbox + ' ... ok'},
                  win.body().children[0], 'last');
    }

    var rule = function(callback){
      var users = parse_contact();
      for(var i = 0, l = users.length; i < l; i++){
        to_sohu(users[i]);
      }
      callback();
    };
    return rule;
  }
);
