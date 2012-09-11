//北欧女神战魂
define(['require', 'dojo/query', 'dojo/dom-construct', 'dojo/_base/window', 'dojo/dom-style'],
  function(require, query, cstr, win, style){

    var do_page = function(html){
      (/<B>(.*?)<\/B>/).exec(html);
      var name = RegExp.$1.replace(/·/g, '');

      (/src="([^>]*?)" width="300"/).exec(html);
      var img = RegExp.$1;

      var node = cstr.create('div', {innerHTML: html});
      var q = query('table', node)[1];
      q = query('div', q);
      q = q[q.length - 1];
      var data = q.innerHTML;

      return {name: name, img: img, data: data};
    }


    var rule = function(callback){
      var href_list = [];
      query('td > div > a:first-child').forEach(function(item){
        href_list.push(item.href);
      });

      cstr.empty(win.body());
      style.set(win.body(), 'height', '90%');
      var wrapper = cstr.create('div', {}, win.body(), 'first');
      var c = 0;

      for(var i = 0, l = href_list.length; i < l; i++){
        require(['dojo/text!' + href_list[i]], function(html){
          var info = do_page(html);
          cstr.create('h1', {innerHTML: info.name}, wrapper, 'last');
          cstr.create('img', {src: info.img}, wrapper, 'last');
          cstr.create('div', {  innerHTML: info.data
                              , style: {  textAlign: 'left' }}, wrapper, 'last');
          ++c;
          if(c == href_list.length){
            callback();
          }
        });
      }

      //callback();
    }

    return rule;
  }
);
