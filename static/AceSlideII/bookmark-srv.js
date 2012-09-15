javascript: (function(){ if((typeof dojo) != 'undefined'){return} var ip=prompt('Server')||''; if(!ip || ip==''){return} var html = document.documentElement.innerHTML; window.dojoConfig = { async: true , packages: [ {name: 'AceSlideII', location: 'http://' + ip + '/static'} ] , deps: ['AceSlideII/srv-init'] , callback: function(init){ init(ip, html); } }; var n = document.createElement('script'); n.type='text/javascript'; n.src='http://' + ip + '/dojo/dojo/dojo.js'; document.getElementsByTagName('head')[0].appendChild(n); })();

(function(){
  if((typeof dojo) != 'undefined'){return}
  var ip=prompt('Server')||'';
  if(!ip || ip==''){return}
  var html = document.documentElement.innerHTML;
  window.dojoConfig = {
      async: true
    , packages: [
      {name: 'AceSlideII', location: 'http://' + ip + '/static'}
    ]
    , deps: ['AceSlideII/srv-init']
    , callback: function(init){
      init(ip, html);
    }
  };
  var n = document.createElement('script');
  n.type='text/javascript';
  n.src='http://' + ip + '/dojo/dojo/dojo.js';
  document.getElementsByTagName('head')[0].appendChild(n);
})();
