//批量创建
define(['http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js'],
  function(_){
    var create = function(domain, obj_list){
      var will_p = {
        _method: 'new',
        name: domain.name,
        admin: domain.admin,
        password: domain.password,
        password2: domain.password,
        count: domain.count,
        province: '北京市',
        city: '北京市',
        product: '0',
        srv_provider: '0',
        company: '数据升级',
        contact: '搜狐企邮',
        csource: '0',
        email: 'test@test.sohu.net',
        enterprise: '0',
        industry: '2',
        tel: '88888888',
        agent: 'sohuagent',
        belong: 'sohuagent',
      }

      var will_defer = $.ajax({
        url: '/will',
        type: 'POST',
        data: will_p,
        dataType: 'json',
        success: function(response){
          if(response.result == 0){
            $('#' + domain.id).append('<span style="margin-left: 10px;">意向成功</span>');
          } else {
            $('#' + domain.id).append('<span style="margin-left: 10px;">意向失败</span>');
            if(obj_list.length > 0){
              create(obj_list.shift(), obj_list);
            }
          }
        }
      });

      var record_defer = will_defer.then(function(response){
        var defer = $.ajax({
          url: '/record',
          type: 'POST',
          data: {_method: 'record', volumn: response.volumn},
          dataType: 'json',
          success: function(response){
            if(response.status == '0'){
              $('#' + domain.id).append('<span style="margin-left: 10px;">报备成功</span>');
            } else {
              $('#' + domain.id).append('<span style="margin-left: 10px;">报备失败</span>');
              if(obj_list.length > 0){
                create(obj_list.shift(), obj_list);
              }
            }
          }
        });
        return defer;
      });


      var query_defer = record_defer.then(function(response){
        if(response.status != '0'){
          return;
        }
        var defer = $.ajax({
          url: '/record',
          type: 'POST',
          data: {_method: 'record_query', name: domain.name},
          dataType: 'json',
          success: function(response){
            domain.did = response.obj_list[0].id;
          }
        });        
        return defer;
      });

      var create_defer = query_defer.then(function(response){
        var defer = $.ajax({
          url: '/order',
          type: 'POST',
          data: {_method: 'record_trial', id: domain.did},
          dataType: 'json',
          success: function(response){
            if(response.status == '0'){
              $('#' + domain.id).append('<span style="margin-left: 10px;">试用成功</span>');
            } else {
              $('#' + domain.id).append('<span style="margin-left: 10px;">试用失败</span>');
              if(obj_list.length > 0){
                create(obj_list.shift(), obj_list);
              }
            }
          }
        });
        return defer;
      });

      create_defer.then(function(response){
        $('#' + domain.id).append('<span style="margin-left: 10px;">结束, 整下一个</span>');
        if(obj_list.length > 0){
          create(obj_list.shift(), obj_list);
        }
      });


    }

    var process = function(obj_list){
      $.each(obj_list, function(i, e){
        var node = $('<p id="' + e.id + '"></p>');
        $('body').append(node);
        node.append('<span>' + e.name + '</span>');
      });
      
      var domain = obj_list.shift();
      create(domain, obj_list);
    }


    var rule = function(callback){
      $('body').empty();
      $('body').append('<p>添加一组域, 每行一个, 字段之间以 # 分割</p>');
      $('body').append('<p><textarea id="data" style="width: 800px;" rows="10">demo.sohu.net#admin#1111aaaa#3</textarea></p>');
      $('body').append('<p><button id="btn">开始添加</button></p>');
      $('body').append('<hr />');

      $('#btn').click(function(){
        var text = $('#data').val();
        var domain_list = [];
        $.each(text.split('\n'), function(i, e){
          var v_list = e.split('#');
          var domain = {};
          domain.id = 'idx-' + i;
          domain.name = $.trim(v_list[0]);
          domain.admin = $.trim(v_list[1]);
          domain.password = $.trim(v_list[2]);
          domain.count = $.trim(v_list[3]);
          domain_list.push(domain);
        });
        process(domain_list);
      });
    };
    return rule;
  }
);
