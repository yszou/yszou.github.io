# -*- coding: utf-8 -*-

INDEX_CODE = [
    ('source/about.t2t', '2013-02-19 19:13:48', 'c1737f026ee6130211917cd9d4ccfe08'),
    ('source/captcha.t2t', '2013-02-19 19:13:48', '1b4ba1d94f8e2a33c907ad632ae68702'),
    ('source/angular.t2t', '2013-02-19 19:13:48', '2e72ede01c0b2f38ff51bf662b74f8ba'),
]

INDEX_GAME = [
    ('source/about.t2t', '2013-02-19 19:15:48', 'c1737f026ee6130211917cd9d4ccfe08'),
]


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
        else:
            l.append("    ('%s', '%s', '%s'),\n" % (source, date, md5))

    data = re.sub('INDEX_CODE = \[.*?\]', 'INDEX_CODE = [\n%s]' % ''.join(l), data, 1, re.S)


    l = []
    for source, date, md5 in [func_map[len(x)](x) for x in INDEX_GAME]:
        with open(source, 'r') as f:
            s = f.read()
        m = hashlib.md5(s).hexdigest()

        if m != md5:
            l.append("    ('%s', '%s', '%s'),\n" % (source, datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), m))
        else:
            l.append("    ('%s', '%s', '%s'),\n" % (source, date, md5))

    data = re.sub('INDEX_GAME = \[.*?\]', 'INDEX_GAME = [\n%s]' % ''.join(l), data, 1, re.S)



    with open(__file__, 'w') as f:
        f.write(data)


if __name__ == '__main__':
    update()
