//映射各种规则
define([], function(){
  var rules = [
      [/^http:\/\/zouyesheng\.com.*$/, 'default']
    , [/^http:\/\/localhost.*$/, 'define']
    , [/^http:\/\/vp\.ffsky\.cn\/chrs2\.htm$/, 'vp2_chrs2']
    , [/^http:\/\/cwebmail\.mail\.163\.com.*$/, 'mail_163']
    , [/^http:\/\/web2?\.qq\.com.*$/, 'web_qq']
    , [/^https?:\/\/www\.google\.com\/search.*$/, 'google_search']
    , [/^https?:\/\/www\.google\.com\.hk\/search.*$/, 'google_search']
    , [/^http:\/\/reseller\.mail\.sohu\.net.*$/, 'sohu_net']
  ];
  return rules;
});
