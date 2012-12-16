# -*- coding: utf-8 -*-

'生成站点地图'

import os
from os.path import join
import sys
import imp
import time

D = os.path.dirname(__file__)
sys.path.insert(0, join(D, '..'))


if __name__ == '__main__':
    from django.conf import settings as django_settings
    settings = imp.load_source('settings', join(D, '..', 'settings.py'))
    django_settings.configure(DATABASES = settings.DATABASES)


from Schema.models import Blog

BLOG_DIR = os.path.abspath(join(D, '..', '..', 'DATA',
                                'AceFantasyVI', 'blog'))

HEAD = '''
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
%s
</urlset>
'''

TEMPLATE = '''
<url>
    <loc>http://zouyesheng.com/%s.html</loc>
    <lastmod>%s</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
</url>
'''

def main():
    '生成站点地图'


    blog_list = list(Blog.objects.filter(status=0).order_by('-create')\
                         .values('name', 'create'))

    s = ''
    for b in blog_list:
        s += TEMPLATE % (b['name'],
                 time.strftime('%Y-%m-%d', time.localtime(b['create'])))

    r = HEAD % s

    with open(join(BLOG_DIR, 'sitemap.html'), 'w') as f:
        f.write(r)


if __name__ == '__main__':
    main()
