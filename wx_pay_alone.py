# -*- coding: utf-8 -*-


WX_APPID = 'wxd14ddba8a72f9b7e'
WX_SECRET = '4becd8c773aaab69f7ab18fdc5******'
WX_KEY = 'c87691fe4ff768642827243b3A814211'
WX_MCH_ID = '1230789102'
WX_NOTIFY_URL = ''




from urllib.parse import urlencode
import tornado.gen
from tornado.escape import json_decode
from tornado.httpclient import HTTPClient, HTTPRequest, AsyncHTTPClient

class BaseService(object):
    method = 'get'
    url = 'http://localhost:8888'
    base = ''
    headers = {}
    json = True

    def __init__(self):
        pass

    def gen_request(self):

        p = self.p.copy()
        for k in p:
            if type(p[k]) in [bytes]:
                p[k] = p[k].decode('utf8')

        if self.method == 'get':
            url = '%s%s%s?%s' % (self.url, self.base, self.path, urlencode(p))
            body = None
        else:
            url = '%s%s%s' % (self.url, self.base, self.path)
            body = urlencode(p)

        if self.method == 'post' and 'Content-Type' not in self.headers:
            self.headers['Content-Type'] = 'application/x-www-form-urlencoded'


        req = HTTPRequest(url, method=self.method.upper(), headers=self.headers, body=body)
        return req


    def parse_response(self, res):
        if self.json:
            return json_decode(res.body)
        else:
            return res.body


    def sync(self):
        req = self.gen_request()
        res = HTTPClient().fetch(req)
        res = self.parse_response(res)
        return res




import uuid
import datetime
import time
import hashlib
import urllib



class WXPayService(BaseService):

    def gen_request(self):
        p = self.p

        if self.method == 'get':
            url = '%s%s%s?%s' % (self.url, self.base, self.path, p)
            body = None
        else:
            url = '%s%s%s' % (self.url, self.base, self.path)
            body = p

        if self.method == 'post' and 'Content-Type' not in self.headers:
            self.headers['Content-Type'] = 'application/x-www-form-urlencoded'

        req = HTTPRequest(url, method=self.method.upper(), headers=self.headers, body=body)
        return req

    def check_sign(self, p):

        pp = p.copy()
        for k in pp.keys():
            if isinstance(pp[k], bytes):
                pp[k] = pp[k].decode('utf8')

        return p['sign'] == self.sign(pp)


    def sign(self, p):
        keys = list(p.keys())
        keys.sort()
        s = []
        for k in keys:
            if (k not in ['sign']) and (p[k] != ''):
                s.append('%s=%s' % (k, p[k]))

        s.append('%s=%s' % ('key', WX_KEY))
        s = '&'.join(s)
        hash = hashlib.md5(s.encode('utf-8')).hexdigest().upper()
        return hash

    def get_json_params(self, prepay_id):
        p = {
            'appId': WX_APPID,
            'timeStamp': int(time.time()),
            'nonceStr': uuid.uuid4().hex[:32],
            'package': 'prepay_id=%s' % prepay_id,
            'signType': 'MD5',
            'paySign': '',
        }
        p['paySign'] = self.sign(p)
        return p


    def create_order(self, number, price, title, detail, attach, ip, user_open_id):
        self.method = 'post'
        self.path = '/pay/unifiedorder'
        self.json = False
        self.url = 'https://api.mch.weixin.qq.com'
        self.headers = {'Content-Type': 'text/xml'}
        

        now = int(time.time())
        start = datetime.datetime.fromtimestamp(now).strftime('%Y%m%d%H%M%S')
        expire = datetime.datetime.fromtimestamp(now + 60 * (5 + 1)).strftime('%Y%m%d%H%M%S')

        p = {
            'appid': WX_APPID,
            'mch_id': WX_MCH_ID,
            'device_info': 'WEB',
            'nonce_str': uuid.uuid4().hex[:32],
            'sign': '',
            'body': title,
            'detail': detail,
            'attach': attach,
            'out_trade_no': number,
            'fee_type': 'CNY',
            'total_fee': int(price * 100),
            'spbill_create_ip': ip,
            'time_start': start,
            'time_expire': expire,
            'notify_url': WX_NOTIFY_URL,
            'trade_type': 'JSAPI',
            'openid': user_open_id,
        }

        for k in p.keys():
            if isinstance(p[k], bytes):
                p[k] = p[k].decode('utf8')

        p['sign'] = self.sign(p)

        s = []
        for k in p.keys():
            s.append('<%s><![CDATA[%s]]></%s>' % (k, p[k], k))

        s = '<xml>' + '\n' + '\n'.join(s) + '\n' + '</xml>'
        self.p = s

        return self


if __name__ == '__main__':
    srv = WXPayService()
    p = {
        'number': 't000',
        'price': 0.01,
        'title': 'test',
        'detail': 'detail',
        'attach': 'attachment',
        'ip': '8.8.8.8',
        'user_open_id': ''
    }
    req = srv.create_order(**p)
    print(req.sync().decode('utf-8'))
