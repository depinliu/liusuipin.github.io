#!/usr/bin/python3
# mod : Enum module
# cre : lwx 20201122
# upd : lwx 20201122
# ver : 1.0

import bottle
from bottle import Bottle, route, run, get, post, put, delete, error, request, response
import json
import uuid
import xmltodict
from datetime import datetime
import pytz
from lib import CONTENT_TYPE_JSON, enable_cors, logErrReturnJSON , addHeaderDefault
import string
from db import Conn
import logging
import logging.config
import base64

modEnum = Bottle()

logger = logging.getLogger()

# enum data design:
# enum = {
#     "id": "ID",
#     "c": "CODE",
#     "d": [ # description
#         {
#             "id": "Indonesia",
#             "en": "English"
#         }
#     ],
#     "e":[ # enum detail list
#         "c": "CODE",
#         "d": [ # description
#             {
#                 "id": "Indonesia",
#                 "en": "English"
#             }
#         ],
#     ]
# }

@modEnum.route('/enum/l', method='OPTIONS')
@modEnum.route('/enum/g/<id>', method='OPTIONS')
@modEnum.route('/enum/s/<id>', method='OPTIONS')
@modEnum.route('/enum/d/<id>', method='OPTIONS')
@addHeaderDefault
def _():
    return ''

# List enum
@modEnum.route('/enum/l',method='GET')
@addHeaderDefault
def enumL():
    response.content_type = CONTENT_TYPE_JSON
    try:
        pass
    except Exception as e:
        return logErrReturnJSON(logger, "-1", e)

#GET DATA Enum From ng-Table====================
@modEnum.route('/Getenum',method='GET')
@addHeaderDefault
def enum():
    response.content_type = CONTENT_TYPE_JSON
    try:
        #data = request.json
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select * from en"
                cur.execute(sql)
                row_headers=[x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        json_data=[]
        for result in result:
            json_data.append(dict(zip(row_headers,result)))
        if len(json_data) == 0 : 
            return json.dumps({'s':1, 'data': '{}' })
        else :
            return json.dumps({'s':0, 'data': json_data})
    except Exception as e:
        return e

#//Add Enum===========
@modEnum.route('/tambahEnum',method='POST')
@addHeaderDefault
def tambahEnum():
    # tz   = pytz.timezone('Asia/Jakarta')
    # crdate  = str(datetime.now(tz))
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    #data['ids']
    # intp = (data['ids'],)
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "insert into en (active,enname) values(%s,%s)"
                intp = (1,data['enname'],)
                cur.execute (sql, intp)
                # row_headers=[x[0] for x in cur.description]
                # result = cur.fetchall()
            conn.commit()
        conn.close()
        return json.dumps({'s':0})
        #return json.dumps(json_data)
    except Exception as e:
        logger.error(e) 
        return json.dumps({'s':1})



# @modEnum.route('/getEnumDetailEdit',method='GET')
# @addHeaderDefault
# def getProvEdt():
#     response.content_type = CONTENT_TYPE_JSON
#     data = request.json
#     #data['ids']
#     intp = (data['id'],)
#     try:
#         connCtrl = Conn()
#         with connCtrl.getConn() as conn:
#             with conn.cursor() as cur:
#                 sql = "SELECT a.id, a.enname,to_char(a.cdate,'YYYY-mm-dd hh:mm')as cdate, a.active from es  as a where id= %s"
#                 cur.execute(sql,intp)
#                 row_headers=[x[0] for x in cur.description]
#                 result = cur.fetchall()
#             conn.commit()
#         connCtrl.close()
#         json_data=[]
#         for result in result:
#             json_data.append(dict(zip(row_headers,result)))
#         if len(json_data) == 0 : 
#             return json.dumps({'s':1, 'data': '{}' })
#         else :
#             return json.dumps({'s':0, 'data': json_data})
#         #return json.dumps(json_data)
#     except Exception as e:
#         logger.error(e) 
#         return e


##//===Add Enum Detail=======
@modEnum.route('/tambahEnumDetail',method='POST')
@addHeaderDefault
def tambahEnumDetail():
    # tz   = pytz.timezone('Asia/Jakarta')
    # crdate  = str(datetime.now(tz))
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    #data['ids']
    # intp = (data['ids'],)
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "insert into endetail (iden,des,active) values(%s,%s,%s)"
                intp = (data['enname']['id'],data['des'],1)
                cur.execute (sql, intp)
                # row_headers=[x[0] for x in cur.description]
                # result = cur.fetchall()
            conn.commit()
        conn.close()
        return json.dumps({'s':0})
        #return json.dumps(json_data)
    except Exception as e:
        logger.error(e) 
        return json.dumps({'s':1})


@modEnum.route('/delEnum', method='POST')
@addHeaderDefault
def delEnum():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = "delete from en where id = %s"
                intp = (data['de'],)
                cur.execute(sql,intp)
            con.commit()
        con.close()
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e)
        return json.dumps({'s':1})



@modEnum.route('/getEnEdit',method='POST')
@addHeaderDefault
def getEnEdit():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    #data['ids']
    intp = (data['id'],)
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "SELECT a.id, a.enname,to_char(a.cdate,'YYYY-mm-dd hh:mm')as cdate, a.active from en as a where id= %s"
                cur.execute(sql,intp)
                row_headers=[x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        json_data=[]
        for result in result:
            json_data.append(dict(zip(row_headers,result)))
        if len(json_data) == 0 : 
            return json.dumps({'s':1, 'data': '{}' })
        else :
            return json.dumps({'s':0, 'data': json_data})
        #return json.dumps(json_data)
    except Exception as e:
        logger.error(e) 
        return e

@modEnum.route('/updateEn',method='POST')
@addHeaderDefault
def updateProv():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    #data['ids']
    intp = (data['enname'],data['active'], data['id'])
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "update en set enname = %s ,active = %s where id = %s"
                cur.execute(sql,intp)
                # test = 'test'
            conn.commit()
        connCtrl.close()
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e) 
        return e

@modEnum.route('/updateEndet',method='POST')
@addHeaderDefault
def updateEndet():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    #data['ids']
    intp = (data['des'], data['active'],data['enname']['id'], data['id'])
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "update endetail set des = %s, active=%s , iden = %s where id = %s"
                cur.execute(sql,intp)
            conn.commit()
        connCtrl.close()
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e) 
        return e


@modEnum.route('/delEnumDet', method='POST')
@addHeaderDefault
def delEnumDet():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = "delete from endetail where id = %s"
                intp = (data['det'],)
                cur.execute(sql,intp)
            con.commit()
        con.close()
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e)
        return json.dumps({'s':1})