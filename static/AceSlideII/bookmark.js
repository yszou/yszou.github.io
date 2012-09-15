javascript: (function(){ if((typeof dojo) != 'undefined'){return} window.dojoConfig = { async: true , packages: [ {name: 'AceSlideII', location: 'http://localhost:8888/AceSlideII'} ] , deps: ['AceSlideII/init'] , callback: function(init){ init({width: 600}); } }; var n = document.createElement('script'); n.type='text/javascript'; n.src='http://ajax.googleapis.com/ajax/libs/dojo/1.8.0/dojo/dojo.js'; document.getElementsByTagName('head')[0].appendChild(n); })();


(function(){
  if((typeof dojo) != 'undefined'){return}
  window.dojoConfig = {
      async: true
    , packages: [
      {name: 'AceSlideII', location: 'http://zouyesheng.com/static/AceSlideII'}
    ]
    , deps: ['AceSlideII/init']
    , callback: function(init){
      init({width: 600});
    }
  };
  var n = document.createElement('script');
  n.type='text/javascript';
  n.src='http://ajax.googleapis.com/ajax/libs/dojo/1.8.0/dojo/dojo.js';
  document.getElementsByTagName('head')[0].appendChild(n);
})();
