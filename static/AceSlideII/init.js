//初始化函数

define(['dojo/dom-construct'], function(cstr){
  var cstr = cstr;
  var init = function(obj){
    var n = cstr.create('div', {innerHTML: 'AceSlideII is loading ...',
                                style: {  color: '#015F68'
                                        , fontSize: '14px'
                                        , backgroundColor: '#DBF7F9'
                                        , border: '1px solid #008793'
                                        , padding: '5px'
                                        , width: '250px'
                                        , height: '16px'
                                        , lineHeight: '16px'
                                        , position: 'fixed'
                                        , top: '5px'
                                        , left: screen.width / 2 - (250 / 2) + 'px'}},
                        document.body, 'last');
    var fw = obj.width || 600;
    console.log('[ASII]AceSlideII is starting ...');
    require([  'AceSlideII/rules/0rules'
             , 'AceSlideII/sub'
             , 'AceSlideII/canvas'
             , 'AceSlideII/frames'
             , 'AceSlideII/keys'
             , 'AceSlideII/mobile'
             , 'dojo/domReady!'
            ],
      function(rules, sub, canvas, frames){

        var r = null;
        for(var i = 0, l = rules.length; i < l; i++){
          if(rules[i][0].exec(window.location.href)){
            r = rules[i][1];
            break;
          }
        }

        console.log('[ASII]Select Rule: ' + r);
        require(['AceSlideII/rules/' + (r || 'default')], function(rule){
          rule(function(){
            setTimeout(function(){cstr.destroy(n)}, 1000);
            sub(frames(fw, fw * screen.height / screen.width), canvas());
            console.log('[ASII]AceSlideII is OK');
          });
        });

      }
    ); 
  }
  return init;
});
