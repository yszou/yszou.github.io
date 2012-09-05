//初始化函数

define([], function(){
  var init = function(obj, cstr){
    var n = cstr.create('div', {innerHTML: 'AceSlideII is loading ...',
                                style: {  color: '#015F68'
                                        , fontSize: '14px'
                                        , backgroundColor: '#DBF7F9'
                                        , border: '1px solid #008793'
                                        , padding: '5px'
                                        , width: '150px'
                                        , height: '16px'
                                        , lineHeight: '16px'
                                        , position: 'absolute'
                                        , top: '5px'
                                        , left: screen.width / 2 - (150 / 2) + 'px'}},
                        document.body, 'last');
    var fw = obj.width || 600;
    console.log('AceSlideII is starting ...');
    require([  'AceSlideII/sub'
             , 'AceSlideII/canvas'
             , 'AceSlideII/frames'
             , 'AceSlideII/keys'
             , 'AceSlideII/mobile'
             , 'dojo/domReady!'
            ],
      function(sub, canvas, frames){
        setTimeout(function(){cstr.destroy(n)}, 1000);
        sub(frames(fw, fw * screen.height / screen.width), canvas());
        console.log('AceSlideII is OK');
      }
    ); 
  }
  return init;
});
