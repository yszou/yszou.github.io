# -*- coding: utf-8 -*-

INDEX_CODE = [
    ('source/jquery.t2t', '2013-02-19 22:36:49', '424994be2295d81402d1a3cce9a25648'),
    ('source/angular.t2t', '2013-02-19 22:36:50', '2e72ede01c0b2f38ff51bf662b74f8ba'),
    ('source/python-module-c.t2t', '2013-02-19 22:36:50', '9ea3a47e7d8f54b9be7607c22abbd661'),
    ('source/imagemagick.t2t', '2013-02-19 22:36:51', '1c04d9be72aeb6b166ae3b4476b75102'),
    ('source/AceSlideII.t2t', '2013-02-19 22:36:51', '9dd69b367b54ffbc4220b96b3495fda8'),
    ('source/vimim-wubi.t2t', '2013-02-19 22:36:51', '5cf6845525d0739c33080033d99a7580'),
    ('source/captcha.t2t', '2013-02-19 22:36:51', '1b4ba1d94f8e2a33c907ad632ae68702'),
    ('source/oauth-sina.t2t', '2013-02-19 22:36:52', '6b1591d49ed0344f1a23ddb9b427f386'),
    ('source/xmodmap-usage.t2t', '2013-02-19 22:36:52', 'e1443254757fba0e1187a807a5c7578d'),
    ('source/generator-for-async.t2t', '2013-02-19 22:36:52', '89ae20cca051b75dacb0f6c2766bcce0'),
    ('source/reusable-webui-component.t2t', '2013-02-19 22:36:53', '416e06870cdcec119b4a37bda59973da'),
    ('source/solution-in-solution.t2t', '2013-02-19 22:36:53', 'b2e801e9b7043c7a702e74a2aff9f11e'),
    ('source/django-orm-in-tornado.t2t', '2013-02-19 22:36:53', 'd0b78f65444a6bdb9d73c4fb37553b72'),
    ('source/about.t2t', '2013-02-19 22:36:54', 'c1737f026ee6130211917cd9d4ccfe08'),
]

INDEX_GAME = [
]


def gen(source, type):
    '生成指定文件到指定目录'

    import os

    cmd = 'txt2tags -t xhtml --toc-level=2 --encoding=utf-8 --enum-title --mask-email -o %s/%s.html %s' % (type, os.path.basename(source).split('.')[0], source)
    os.system(cmd)


def update():
    '更新INDEX中的时间与MD5'

    import hashlib, re, datetime

    with open(__file__) as f:
        data = f.read()

    func_map = {
        1: lambda i: (i[0], '', ''),
        2: lambda i: (i[0], i[1], ''),
        3: lambda i: (i[0], i[1], i[2]),
    }

    l = []
    for source, date, md5 in [func_map[len(x)](x) for x in INDEX_CODE]:
        with open(source, 'r') as f:
            s = f.read()
        m = hashlib.md5(s).hexdigest()

        if m != md5:
            l.append("    ('%s', '%s', '%s'),\n" % (source, datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), m))
            gen(source, 'code')
        else:
            l.append("    ('%s', '%s', '%s'),\n" % (source, date, md5))

    p = re.compile('INDEX_CODE = \[.*?\]', re.S)
    data = p.sub('INDEX_CODE = [\n%s]' % ''.join(l), data, 1)


    l = []
    for source, date, md5 in [func_map[len(x)](x) for x in INDEX_GAME]:
        with open(source, 'r') as f:
            s = f.read()
        m = hashlib.md5(s).hexdigest()

        if m != md5:
            l.append("    ('%s', '%s', '%s'),\n" % (source, datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), m))
            gen(source, 'game')
        else:
            l.append("    ('%s', '%s', '%s'),\n" % (source, date, md5))

    p = re.compile('INDEX_GAME = \[.*?\]', re.S)
    data = p.sub('INDEX_GAME = [\n%s]' % ''.join(l), data, 1)



    with open(__file__, 'w') as f:
        f.write(data)


if __name__ == '__main__':
    update()
