//映射各种规则
define([], function(){
  var rules = [
      [/^http:\/\/zouyesheng\.com.*$/, 'default']
    , [/^http:\/\/localhost.*$/, 'default']
    , [/^http:\/\/vp\.ffsky\.cn\/chrs2\.htm$/, 'vp2_chrs2']
    , [/^http:\/\/cwebmail.mail.163.com.*$/, 'mail_163']
  ];
  return rules;
});
