# -*- coding: utf-8 -*-

'生成rss2.0 feed'

import os
from os.path import join
import sys
import imp

D = os.path.dirname(__file__)
sys.path.insert(0, join(D, '..'))

from feedformatter import Feed

if __name__ == '__main__':
    from django.conf import settings as django_settings
    settings = imp.load_source('settings', join(D, '..', 'settings.py'))
    django_settings.configure(DATABASES = settings.DATABASES)

from Schema.models import Blog

BLOG_DIR = os.path.abspath(join(D, '..', '..', 'DATA',
                                'AceFantasyVI', 'blog'))

def main():
    '生成RSS文件'
    
    feed = Feed()
    feed.feed['title'] = 'AceFantasyVI'
    feed.feed['language'] = 'zh-CN'
    feed.feed['copyright'] = 'Copyright 2010-2012, Yesheng Zou'
    feed.feed['link'] = 'http://zouyesheng.com'
    feed.feed['author'] = u'邹业盛'
    feed.feed['description'] = u'Ace... 邹业盛的个人站点'

    blog_list = list(Blog.objects.filter(status=0).order_by('-create')\
                         .values('title', 'name', 'create')[:10])
    for blog in blog_list:
        item = {}
        item['title'] = blog['title']
        item['link'] = 'http://zouyesheng.com/%s.html' % blog['name']
        item['guid'] = blog['name']
        item['pubDate'] = blog['create'] - 14 * 60 * 60
        with open(join(BLOG_DIR, '%s.html' % blog['name']), 'r') as f:
            item['description'] = f.read().decode('utf8')
        feed.items.append(item)

    with open(join(BLOG_DIR, 'rss.html'), 'w') as f:
        f.write(feed.format_rss2_string(pretty=False))


if __name__ == '__main__':
    main()
