#! /usr/bin/python
# -*- coding: utf-8 -*-

def what_new():
    import sync
    import glob
    from hashlib import md5

    fiels = glob.glob('*.t2t')
    new_files = []
    for path in fiels:
        if path.startswith('index'):
            continue
        with open(path, 'r') as f:
            data = f.read()
        hash = md5(data.rstrip().encode('utf-8')).hexdigest()

        if path not in sync.ARTICLE or sync.ARTICLE[path] != hash:
            new_files.append(path)
            sync.ARTICLE[path] = hash

    import pprint
    s = pprint.pformat(sync.ARTICLE)
    s = 'ARTICLE = %s' % s
    with open('sync.py', 'w') as f:
        f.write(s)
    return new_files

def transfer(path):
    import os
    path = os.path.abspath(path)
    cmd = 'txt2tags -t xhtml --toc-level=2 --encoding=utf-8 --enum-title --mask-email -o /home/zys/temp/yszou/%s.html %s' % (os.path.basename(path).split('.', 1)[0], path)
    os.system(cmd)

def update_index(path):
    import re
    with open('index.t2t', 'r') as f:
        index_data = f.read()

    with open(path, 'r') as f:
        new_title = f.readlines()[0].strip()

    index_data = re.sub(r'=目录=[\r\n]*', '=目录=\n\n- [%s %s.html]\n' % (new_title, path.split('.', 1)[0]), index_data, re.S)
    index_data = re.sub(r'[\r\n]*=提示=', '\n\n\n=提示=', index_data)
    with open('index.t2t', 'w') as f:
        f.write(index_data)


def update_sitemap(path):
    import re
    with open('../sitemap', 'r') as f:
        sitemap_data = f.read()

    import datetime
    today = datetime.date.today().isoformat()

    name_list = re.findall(r'<loc>.*/(.*?)\.html', sitemap_data)
    date_list = re.findall(r'<lastmod>(.*?)<', sitemap_data)
    template = '''
<url>
    <loc>http://zouyesheng.com/%s.html</loc>
    <lastmod>%s</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
</url>
'''
    data = ''
    for name, date in zip(name_list, date_list):
        if name != path.split('.', 1)[0]:
            data += template % (name, date)

    data = template % (path.split('.', 1)[0], today) + data
    data = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
''' + data
    data += '\n'


    with open('../sitemap', 'w') as f:
        f.write(data)

def update_rss(path):
    import re
    with open('../sitemap', 'r') as f:
        sitemap_data = f.read()
    name_list = re.findall(r'<loc>.*/(.*?)\.html', sitemap_data)
    date_list = re.findall(r'<lastmod>(.*?)<', sitemap_data)

    import datetime
    for i,o in enumerate(date_list):
        date_list[i] = int(datetime.date(*[int(x) for x in o.split('-')]).strftime('%s'))

    pair = list(zip(name_list, date_list))
    pair.sort(lambda x, y: -1 if x[1] > y[1] else 1)

    from feed.feedformatter import Feed

    feed = Feed()
    feed.feed['title'] = u'进出自由,我的分享'
    feed.feed['language'] = 'zh-CN'
    feed.feed['copyright'] = 'Copyright 2010-2022, Yesheng Zou'
    feed.feed['link'] = 'http://zouyesheng.com'
    feed.feed['author'] = u'邹业盛'
    feed.feed['description'] = u'邹业盛的个人站点'

    import re
    for name, date in pair:
        with open('%s.t2t' % name, 'r') as f:
            title = f.readlines()[0].strip()

        item = {}
        item['title'] = title.decode('utf8')
        item['link'] = 'http://zouyesheng.com/%s.html' % name
        item['guid'] = name
        item['pubDate'] = date - 14 * 60 * 60

        with open('../%s.html' % name, 'r') as f:
            item['description'] = f.read().decode('utf8')
            item['description'] = re.sub(r'src="img/(.*?)\.(.*?)"', r'src="http://zouyesheng.com/img/\1.\2"', item['description'])
        feed.items.append(item)

    result = feed.format_rss2_string(pretty=False)
    with open('../rss', 'w') as f:
        f.write(result)


if __name__ == '__main__':
    new = what_new()
    for f in new:
        print(f, '...')
        transfer(f)
        update_index(f)
        update_sitemap(f)
        update_rss(f)
    transfer('index.t2t')
