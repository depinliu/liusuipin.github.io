#! /usr/bin/python3
# mod : main app entry point
# cre : lwx 20180428
# upd : lwx 20191009
# ver : 1.0

import bottle
from bottle import Bottle, route, run, get, post, put, delete, error, request, response, template
import json
import logging
import logging.config
#import psycopg2
#from db import Conn

from lib import enable_cors, CONTENT_TYPE_JSON
from config import LWX, PRODUCT_ID, PRODUCT

from modAuth import modAuth
from modProject import modProject
from modAccounting import modAccounting
# from modDashboard import modDashboard
# from modLaporan import modLaporan
# from admAuth import admAuth
# from modAdm import modAdm
# from modEnum import modEnum
#from modMaster import modMaster

app = Bottle()
app.merge(modAuth)
app.merge(modProject)
app.merge(modAccounting)
# app.merge(modDashboard)
# app.merge(modLaporan)
# app.merge(admAuth)
# app.merge(modAdm)
# app.merge(modEnum)

logging.config.fileConfig('logging.conf')
logger = logging.getLogger()

#region Constant
# LWX = "Li Weixia" #never change this value or everything will not work
# PRODUCT_ID = "hris" #never change this value or everything will not work
# PRODUCT = "lisoft hris" #never change this value or everything will not work
#endregion Constant

#@app.hook('before_request')
#def before_request():
    #bottle.local.logger = logging.getLogger()
    #try:
        #logging.config.fileConfig('logging.conf')
        #bottle.local.logger.debug('before_request')
        #bottle.local.conn = Conn(bottle.local.logger).getConn()
    #except Exception as ex:
        #bottle.local.logger.error(ex, exc_info=True)


#region option
@app.route('/hello', method='OPTIONS')
@app.route('/info', method='OPTIONS')
@enable_cors
def _():
    return ''
#endregion option

@app.hook('after_request')
def after_request():
    try:
        #bottle.local.logger.debug('after_request')
        if hasattr(bottle.local, 'conn'):
            #bottle.local.logger.debug("has conn")
            #print(bottle.local.conn)
            if bottle.local.conn:
                #print(bottle.local.conn)
                logger.debug("after_request: Closing db connection")
                bottle.local.conn.close()
                #print(bottle.local.conn)
                #bottle.local.conn=None
                #print(bottle.local.conn)
    except Exception as ex:
        logger.error(ex, exc_info=True)

@app.error(500)
def error500(code):
    return 'Internal server error!'

@app.route('/info', method='GET')
@enable_cors
def info():
    response.content_type = CONTENT_TYPE_JSON
    return json.dumps({'s': 0, 'd': {"ProductId":PRODUCT_ID, "Product":PRODUCT, "Description":"lisoft hris", "Copyright":"lisoft 2020", "Version":"1.0"}})

@app.route('/hello', method='GET')
@enable_cors
def hello():
    return 'hello lisoft'


# @app.route('/test/<p1>/<p2>', method=['OPTIONS', 'GET'])
# @enable_cors
# def test(p1, p2):
#     ip = request.environ.get('REMOTE_ADDR')
#     return template('ip: {{ip}}, param1: {{p1}}, param2: {{p2}}', dict(ip=ip, p1="{{" + p1 + "}}", p2=p2))


#run(app, host='localhost', port=8070)
#{"host":"localhost","port":"28015","db":"default","user":"admin","password":""}
#dbname='imms' user='ipm' host='172.21.56.15' password='123qaz'
#dbname='kmms' user='ipm' host='localhost' password='}xy#zC4o?d{PxYH4'
#ini testing push baru

#run(app, host='localhost', port=8090)