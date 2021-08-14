# #!/usr/bin/python3
# # mod Admin Kadin
# # cre : SA 181219


import bottle
from bottle import Bottle, route, run, get, post, put, delete, error, request, response
import json
import uuid
import xmltodict
from lib import CONTENT_TYPE_JSON, logErrReturnJSON, stringToBase64, addHeaderDefault
import string
from db import Conn
import logging
import logging.config
import base64

modAdm = Bottle()

logger = logging.getLogger()

#Region Option
@modAdm.route('/admFeatures', method='OPTIONS')
@modAdm.route('/updFeat', method='OPTIONS')





@addHeaderDefault
def _():
    return ''
#end Region Option


# #>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Enumuration <<<<<<<<<<<<<<<<<<<<<<<<<<#

# # @modAdm.route('/admEnum', method='POST')
# # def admEnum():
# #     data = request.json
# #     response.content_type = CONTENT_TYPE_JSON
# #     try:
# #         ConnCtrl as Conn()
# #         with ConnCtrl.getCon() as con:
# #             with con.cursor() as cur:
# #                 sql = ("")
        




 # >>>>>>>>>>>>>>>>>> show all field in table features (Menu) <<<<<<<<<<<<<<<<< #
@modAdm.route('/admFeatures' ,method="POST")
@addHeaderDefault
def admFeatures():
    # response.content_type = CONTENT_TYPE_JSON
    # data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = """select id, fename as menus, deskripsi, routename, idparent, child, feature, menu, active,
                        CASE
                        when active=1 THEN 'active' ELSE 'not active'
                        END as status,
                        CASE
                        when child=1 THEN 'Child' ELSE 'Parent'
                        END as childs
                        from features"""
                # sql = "select*from features"
                cur.execute(sql)
                rowHeader = [x[0]for x in cur.description]
                result = cur.fetchall()
            con.commit()
        connCtrl.close()
        jsonData = []
        for r in result:
            jsonData.append(dict(zip(rowHeader, r)))
        return json.dumps({'feats':jsonData})
    except Exception as e:
        logger.error(e)
        return e
    
    
# def te():
#         response.content_type = CONTENT_TYPE_JSON
#         try:
#             connCtrl = Conn()
#             with connCtrl.getConn() as con:
#                 with con.cursor() as cur:
#                     sql = "select obje from featuresroles where idroles=17"
#                     cur.execute(sql)
#                     # rowHeader = [x[0]for x in cur.description]
#                     result = cur.fetchall()
#                 con.commit()
#             connCtrl.close()
#             return json.dumps(result)
#         except Exception as e:
#             logger.error(e)
#             return e
    
    #>>>>>>>>>>>>>>>>>>>>>>>>> show field in table features by id for edit ( edit menu by Id) <<<<<<<<<<<<<<<<<<<<<#
    
@modAdm.route('/editMenu', method='POST')
@addHeaderDefault
def editMenu():
    response.content_type = CONTENT_TYPE_JSON
    d = request.json
    
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = """select id, fename as menus, deskripsi, routename, idparent, child, feature, menu, active,icon,
                        CASE
                        when active=1 THEN 'active' ELSE 'deactive'
                        END as status,
                        CASE
                        when child=1 THEN 'Child' ELSE 'Parent'
                        END as childs
                        from features
                        where id=%s"""   
                tups = (d['numb'],)
                cur.execute(sql,tups)
                rH = [x[0] for x in cur.description]
                result = cur.fetchall()
            con.commit()
        connCtrl.close()
        jD = []
        for r in result:
            jD.append(dict(zip(rH, r)))
        parsbyId = parentbyId(jD[0]['idparent'])
        pars = parrent()
        return json.dumps({'s':0, 'd':jD[0], 'parr':parsbyId, 'parss':pars})
    except Exception as e:
        logger.error(e)
        return e


def parrent():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = "select id, fename from features"
                cur.execute(sql)
                rH = [x[0] for x in cur.description]
                result = cur.fetchall()
            con.commit()
        connCtrl.close()
        jsonData = []
        for r in result:
            jsonData.append(dict(zip(rH,r)))
        return jsonData
    except Exception as e:
        logger.error(e)
        return e

# function for set parent name by id
def parentbyId(x):
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = "select id, fename from features where id=%s"
                cur.execute(sql,(x,))
                rH = [x[0] for x in cur.description]
                result = cur.fetchall()
            con.commit()
        connCtrl.close()
        jsonData = []
        for r in result:
            jsonData.append(dict(zip(rH, r)))
        return jsonData
    except Exception as e:
        logger.error(e)
        return e
                       

#function update:


#query update jsonb

# update features
# set menu = jsonb_set(jsonb_set(jsonb_set(jsonb_set(menu, '{d}', '"test1"'),'{i}', '"test2"'),'{r}','"member/test"'),'{t}','"1"'),
# fename='Bantuan', deskripsi='halaman bantuan'
# where id = 2

# update featuresroles
# set obje = jsonb_set(obje,'{d,0}','"dashboards"')
# where idroles=17
#==========================================================


#update featuresroles (update jsonb object)
# def updFR():
#     response.content_type = CONTENT_TYPE_JSON
#     dt =request.json
#     try:
#         connCtrl = Conn()
#         with connCtrl.getConn() as con:
#             with con.cursor() as cur:
#                 sql = """UPDATE featuresroles
#                         SET obje =  jsonb_set(jsonb_set(jsonb_set(jsonb_set(obje,'{0, d}', '"d"'),'{0,i}','"i"'),'{0,r}', '"r"'),'{0,t}', '"t"')
#                         where idroles=17"""


#>>>>>> Update Features <<<<<#
@modAdm.route('/updFeat', method='POST')
@addHeaderDefault
def updFeat():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    c = str(data['child'])
    jb = '{"d":"'+data['menus']+'","i":"'+data['icon']+'","r":"'+data['routename']+'","t":"'+c+'"}'
    if data['status'] == 'active':
        stat = 1
    else:
        stat = 0
    try:
        connCtrl = Conn() 
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = """UPDATE features
                         set menu = %s,
                         fename=%s,  icon=%s, routename=%s, child=%s, idparent=%s, deskripsi=%s,  active=%s
                         where id = %s
                    """
                intp = (jb,data['menus'],data['icon'],data['routename'],data['child'],data['parentt']['id'],data['deskripsi'], stat, data['id'])
                cur.execute(sql,intp)
            con.commit()
        connCtrl.close()
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e)
        return e