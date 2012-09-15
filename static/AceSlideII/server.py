# -*- coding: utf-8 -*-

import imp
import os
import uuid
import functools
from os.path import join
from urllib import unquote

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.template


from tornado.options import define, options

define("port", default=8888, help="run on the given port", type=int)

tornado.options.parse_command_line()

DOJO = '/home/zys/static/Documents/dojo-release-1.8.0'
IL = tornado.ioloop.IOLoop.instance()

class BaseHandler(tornado.web.RequestHandler):
    SUPPORTED_METHODS = ('GET', 'POST', 'DELETE', 'PUT', 'OPTIONS')

    def initialize(self):
        '处理构建特殊方法'
        _method = self.get_argument('_method', None)
        if _method is not None:
            self.request.method = _method.upper()

    def finish(self, *args, **kargs):
        self.set_header('Connection', 'close')
        super(BaseHandler, self).finish(*args, **kargs)


class TestHandler(BaseHandler):
    def get(self):
        return self.write('it works!')


class UploadHandler(BaseHandler):
    '''接收上传的数据'''

    SLIDE = []

    def post(self):
        password = self.get_argument('password', '')
        data = unquote(self.get_argument('data', '')).encode('iso-8859-1').decode('utf8')
        data = data.replace('</head>',
            '''
            <script type="text/javascript">
              window.dojoConfig = {
                  async: true
                , packages: [
                  {name: 'AceSlideII', location: '/static'}
                ]
                , deps: ['AceSlideII/init', 'AceSlideII/control']
                , callback: function(init, control){
                  init({width: 600});
                }
              };
            </script>
            <script type="text/javascript" src="/dojo/dojo/dojo.js"></script>
            </head>''')
        cls = self.__class__
        cls.SLIDE.append({'data':'<!DOCTYPE html><html>%s</html>' % data,
                          'password': password})
        return self.redirect('/%s' % (len(cls.SLIDE) - 1))


class SlideHandler(BaseHandler):
    '返回一个文档的内容'

    def get(self, id):
        id = int(id)
        if id >= len(UploadHandler.SLIDE):
            return self.send_error(404)

        return self.write(UploadHandler.SLIDE[id]['data'])


class PullHandler(BaseHandler):
    '获取服务器端的消息'

    CONN = {}

    @tornado.web.asynchronous
    def post(self):
        id = self.get_argument('id', '')
        sync = self.get_argument('sync', '-1')
        if not id or (int(id) >= len(UploadHandler.SLIDE)):
            return self.finish({'result': 1, 'msg': u'错误的名字'})
        else:
            id = int(id)

        try:
            sync = int(sync)
        except ValueError:
            return self.finish({'result': 2, 'msg': u'sync参数错误'})
        sync += 1

        cmd_list = PushHandler.CMD.get(id, [])

        if sync == len(cmd_list):
            #最新情况
            cls = self.__class__
            self.sync = sync
            self.id = id
            if id in cls.CONN:
                cls.CONN[id].append(self)
            else:
                cls.CONN[id] = [self]
            return

        if sync > len(cmd_list):
            return self.finish({'result': 0, 'msg': '', 'cmd_list': [], 'sync': len(cmd_list) - 1})
        else:
            return_list = cmd_list[sync:]
        return self.finish({'result': 0, 'msg': '', 'cmd_list': return_list, 'sync': len(cmd_list) - 1})


    def release(self):
        cmd_list = PushHandler.CMD.get(self.id, [])
        return_list = cmd_list[self.sync:]
        try:
            return self.finish({'result': 0, 'msg': '', 'cmd_list': return_list, 'sync': len(cmd_list) - 1})
        except:
            pass

    def on_finish(self):
        #print self.__class__.CONN.get('test', [])
        return


class PushHandler(BaseHandler):
    '往服务器端发送消息'
    SUPPORTED_METHODS = ('POST', 'APPLY')

    CMD = {}
    TOKEN = {}

    def post(self):
        token = self.get_argument('token', '')
        cmd = self.get_argument('cmd', '')
        cls = self.__class__
        if token not in cls.TOKEN:
            return self.write({'result': 1, 'msg': u'token错误'})

        id = cls.TOKEN[token]
        if id not in cls.CMD:
            cls.CMD[id] = [cmd]
        else:
            cls.CMD[id].append(cmd)

        [conn.release() for conn in PullHandler.CONN.get(id, [])]
        PullHandler.CONN[id] = []
        return self.write({'result': 0, 'msg': ''})

    def apply(self):
        '申请push的token'
        id = self.get_argument('id', '')
        password = self.get_argument('password', '')
        if not id:
            return self.write({'result': 1, 'msg': u'缺少参数'})
        if int(id) >= len(UploadHandler.SLIDE):
            return self.write({'result': 2, 'msg': u'不存在的项目'})
        if password != UploadHandler.SLIDE[int(id)]['password']:
            return self.write({'result': 3, 'msg': u'密码错误'})
        token = uuid.uuid4().hex
        self.__class__.TOKEN[token] = int(id)
        return self.write({'result': 0, 'msg': '', 'token': token})


class IndexHandler(BaseHandler):
    '显示页面'

    TEMPLATE = tornado.template.Template(
    '''
     <div>当前存在的文档 ({{ len(conns) }})</div>
     <ul>
        {% for k,v in conns.items() %}
            <li><a href="/{{ k }}">{{ k }} ({{ v }})</a></li>
        {% end %}
     </ul>
    ''')

    def get(self):
        slide_list = len(UploadHandler.SLIDE)
        conns = {}
        for i in range(len(UploadHandler.SLIDE)):
            conns[i] = len(PullHandler.CONN.get(i, []))

        r = self.__class__.TEMPLATE.generate(conns=conns)
        return self.write(r)



Handlers = (
    ("/", IndexHandler),
    ("/dojo/(.*)", tornado.web.StaticFileHandler, {'path': DOJO}),
    ("/upload", UploadHandler),
    ("/(\d+)", SlideHandler),
    ("/pull", PullHandler),
    ("/push", PushHandler),

    ("/test", TestHandler),
)


class Application(tornado.web.Application):
    def __init__(self):
        settings = dict(
            cookie_secret="}x3iu3b}N}k0m9c*",
            login_url="/login",
            xsrf_cookies=False,
            static_path=os.path.dirname(os.path.abspath(__file__)),
            template_path = os.path.join(os.path.dirname(__file__), "template"),
            debug=True,
        )
        tornado.web.Application.__init__(self, Handlers, **settings)

def main():
    http_server = tornado.httpserver.HTTPServer(Application(), xheaders=True)
    http_server.listen(options.port)
    print 'running on %s ...' % options.port
    IL.start()


if __name__ == "__main__":
    main()
