var AceSlideII_Init = function(){
  if((typeof require) == 'undefined'){
    setTimeout(AceSlideII_Init, 200);
    return
  } else {
    console.log('AceSlideII is starting ...');
    if(window.AceSlideII){
      console.log('AceSlideII has existed.');
      return;
    } else {
      window.AceSlideII = true;
    }
    require([  'dojo/_base/config'
             , 'AceSlideII/sub'
             , 'AceSlideII/canvas'
             , 'AceSlideII/frames'
             , 'AceSlideII/keys'
             , 'AceSlideII/mobile'
             , 'dojo/domReady!'
            ],
      function(config, sub, canvas, frames){
        sub(frames(config.fw, config.fh), canvas(config.fw, config.fh));
        console.log('AceSlideII is OK');
      }
    ); 
  }
}
AceSlideII_Init();
