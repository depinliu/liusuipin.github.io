#!/usr/bin/python3
# mod : Home
# cre : che 20190829
# upd : che 20190829
# ver : 0.1

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

modHome = Bottle()

#region option
@modHome.route('/kta', method='OPTIONS')
@modHome.route('/rn', method='OPTIONS')
@modHome.route('/getMember', method='OPTIONS')
@modHome.route('/getFile', method='OPTIONS')
@addHeaderDefault
def _():
    return ''
#endregion option

@modHome.route('/kta',method='GET')
@addHeaderDefault
def trackKTA():
    response.content_type = CONTENT_TYPE_JSON
    try:
        data = request.json
        data = request.GET.get('kta')
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                intuple = (data,)
                sql = "select kta.id,ktanum,TO_CHAR(expired,'YYYY-MM-DD MM:SS') AS expired,tracode,TO_CHAR(cdate,'YYYY-MM-DD MM:SS') AS grant,TO_CHAR(rdate ,'YYYY-MM-DD MM:SS') AS request from kta where tracode = %s"
                cur.execute(sql,intuple)
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

@modHome.route('/rn',method='GET')
@addHeaderDefault
def trackRN():
    response.content_type = CONTENT_TYPE_JSON
    try:
        #data = request.json
        nums = request.GET.get('rn')
        typs = request.GET.get('typ')
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                intuple = (nums,typs)
                sql = "select id,nasionalnum from member where nasionalnum = %s and metypes = %s"
                cur.execute(sql,intuple)
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


@modHome.route('/getMember',method='GET')
@addHeaderDefault
def getMember():
    response.content_type = CONTENT_TYPE_JSON
    try:
        #data = request.json
        member_data=[]
        kta_data=[]
        idm = request.GET.get('mem')
        connCtrl = Conn()
        intuple = (idm,)
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select a.id,a.picposition,a.product,a.hs_code,a.dirnpwp,a.dirnomor,a.idlevel,a.forms,a.corporate,a.class,a.npwp,a.phone,a.fax,a.siup,a.tdp,a.certificate,capital,a.sector,a.web,a.city,a.provin,a.address,a.postcode,a.kbli,a.director,a.handphone,a.email,a.commodity,a.structurorg,a.hope,a.resist,a.nasionalnum,a.status,a.metypes,a.picname,a.trackingcode,to_char(a.regdate, 'YYYY-MM-dd HH24:MI:SS') as regdate, b.city as cityname ,c.provin as provname, d.des as klasifikasi, e.level, f.des as formsname from member as a left join city as b on a.city = b.id left join provin as c on a.provin = c.id left join endetail as d on a.class = d.id left join level as e on a.idlevel = e.id left join endetail as f on a.forms = f.id where a.id = %s"
                cur.execute(sql,intuple)
                mem_headers=[x[0] for x in cur.description]
                memresult = cur.fetchall()
            conn.commit()
            with conn.cursor() as kta:
                sqlkta = "select id,ktanum,tracode,to_char(cdate, 'YYYY-MM-dd HH24:MI:SS') as cdate,to_char(expired, 'YYYY-MM-dd HH24:MI:SS') as expired, to_char(rdate, 'YYYY-MM-dd HH24:MI:SS') as rdate,idmember from kta where idmember = %s"
                kta.execute(sqlkta,intuple)
                kta_headers=[x[0] for x in kta.description]
                ktaresult = kta.fetchall()
            conn.commit()
        connCtrl.close()
        for memresult in memresult:
            member_data.append(dict(zip(mem_headers,memresult)))
        for ktaresult in ktaresult:
            kta_data.append(dict(zip(kta_headers,ktaresult)))
        
        #get filedata
        file_data = getFileMember(idm)
        pay_data = getPaymentData(idm)
        correction = getCorrectionMember(idm)
        comments =  getCommentMember(idm)
        if len(member_data) == 0 : 
            return json.dumps({'s':1, 'mem': '{}', 'kta':'{}', 'files':'{}' })
        else : 
            # 'files': file_data,
            return json.dumps({'s':0, 'mem': member_data, 'kta' : kta_data, 'correct' :correction ,'comments':comments,'files': file_data, 'payment':pay_data })
    except Exception as e:
        return e

@modHome.route('/getFile',method='GET')
@addHeaderDefault
def getFile():
    response.content_type = CONTENT_TYPE_JSON
    try:
        idm = request.GET.get('mem')
        file_data = getFileMember(idm)
        return json.dumps({'s':0, 'files': file_data })
    except Exception as e:
        return e

'''Get File untuk Member'''
def getFileMember(v):
    intuple = (v,)
    file_data = []
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as files:
                sqlfil = "select id,idmember,encode(data,'base64') as data,filename,ext,des,to_char(cdate, 'YYYY-MM-dd HH24:MI:SS') as cdate,to_char(udate, 'YYYY-MM-dd HH24:MI:SS') as udate,pic,active,mimetype from files where idmember = %s"
                #encode(data,'base64') as data
                files.execute(sqlfil,intuple) 
                files_headers=[x[0] for x in files.description]
                filesresult = files.fetchall()
            conn.commit()
        connCtrl.close()
        for filesresult in filesresult:
            file_data.append(dict(zip(files_headers,filesresult)))
        return file_data
    except Exception as e:
        s = 9
        return s

def getCorrectionMember(v):
    intuple = (v,0)
    cor_data = []
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as files:
                sqlfil = "select count(uvalue) as cor from validationsdata where idmember=%s and status =%s and uvalue is not null"
                #encode(data,'base64') as data
                files.execute(sqlfil,intuple) 
                files_headers=[x[0] for x in files.description]
                filesresult = files.fetchall()
            conn.commit()
        connCtrl.close()
        return filesresult[0][0]
    except Exception as e:
        s = 9
        return s

def getCommentMember(v):
    intuple = (v,0)
    cor_data = []
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as files:
                sqlfil = "select count(comments) as cor from validationsdata where idmember=%s and status =%s and comments is not null"
                #encode(data,'base64') as data
                files.execute(sqlfil,intuple) 
                files_headers=[x[0] for x in files.description]
                filesresult = files.fetchall()
            conn.commit()
        connCtrl.close()
        return filesresult[0][0]
    except Exception as e:
        s = 9
        return s

def getPaymentData(v): 
    intuple = (v,0)
    pay_data = []
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sqlfil = "select memberi,amt,TO_CHAR(dt,'YYYY-MM-DD MM:SS') AS dt, currency from bill where memberi=%s and billstatus =%s"
                #encode(data,'base64') as data
                cur.execute(sqlfil,intuple) 
                data_headers=[x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        for result in result:
            pay_data.append(dict(zip(data_headers,result)))
        return pay_data
    except Exception as e:
        s = 9
        return s