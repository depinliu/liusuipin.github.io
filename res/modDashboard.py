#!/usr/bin/python3
# mod dashboard
# cre : sa
# upd : sa
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


modDashboard = Bottle()

logger = logging.getLogger()


#region option
@modDashboard.route('/tbperprov', method='OPTIONS')
@modDashboard.route('/chrtForm', method='OPTIONS')
@modDashboard.route('/infMemb', method='OPTIONS')
@modDashboard.route('/lnchrt', method="OPTIONS")
@modDashboard.route('/mdP', method="OPTIONS")
@modDashboard.route('/updt', method='OPTIONS')
@modDashboard.route('/updtCity', method='OPTIONS')
@modDashboard.route('/organizers', method='OPTIONS')
@modDashboard.route('/editOrgSet', method='OPTIONS')
@modDashboard.route('/updateOrgSet', method='OPTIONS')
@modDashboard.route('/orgListEdit', method='OPTIONS')
@modDashboard.route('/updateOrgList', method='OPTIONS')
@modDashboard.route('/lnchrtrequest', method='OPTIONS')
@modDashboard.route('/barMemProv', method='OPTIONS')
@modDashboard.route('/addOrgSet', method='OPTIONS')
@modDashboard.route('/addOrgList', method='OPTIONS')
@modDashboard.route('/delSet', method='OPTIONS')
@modDashboard.route('/delList', method='OPTIONS')
# @modDashboard.route('/test' ,method='OPTIONS')





@addHeaderDefault
def _():
    return ''
#end region option

## --------------------------- Menu Dashboard Kadin_Pusat -------------------------------------##

#bar chart function on dahsboard kadin pusat
@modDashboard.route('/tbperprov' ,method="POST")
@addHeaderDefault
def tbperprov():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = """select a.provin as prov,b.alb,c.ab from provin as a left join 
                (select count(id) as alb,provin from member where metypes = 1 group by member.provin) 
                as b on a.id = b.provin left join (select count(id) as ab,provin from member 
                where metypes = 2 group by member.provin) as c on a.id = c.provin"""
                cur.execute(sql)
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        json_data = []
        for result in result:
            json_data.append(dict(zip(rowHeaders, result)))
        return json.dumps({'s':0, 'data':json_data})
    except Exception as e:
        logger.error(e)
        return e

@modDashboard.route('/barMemProv' ,method="POST")
@addHeaderDefault
def barMemProv():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = """select * from (select a.provin,coalesce(b.alb, 0) as alb,coalesce(c.ab,0) as ab from provin as a
                left join (select count(id) as alb, mem.provin from member as mem 
                where mem.status >= 4 and mem.status <= 6 and metypes = 1 group by mem.provin) as b
                on a.id = b.provin 
                left join (select count(id) as ab, mems.provin from member as mems 
                where mems.status >= 4 and mems.status <= 6 and metypes = 2 group by mems.provin ) as c
                on a.id = c.provin) as master where ab != 0 or alb != 0
                """
                cur.execute(sql)
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        json_data= []
        getprov = []
        getalb = []
        getab = []
        z = 0
        x = 0
        y = 0
        for result in result:
            json_data.append(dict(zip(rowHeaders,result)))
        for provin in json_data:
            getprov.append(json_data[z]['provin'])
            z += 1
        for alb in json_data:
            getalb.append(json_data[x]['alb'])
            x += 1
        for ab in json_data:
            getab.append(json_data[y]['ab'])
            y += 1
        return json.dumps({'s':0,'prov':getprov, 'ab':getab, 'alb': getalb})
    except Exception as e:
        logger.error(e)
        return e

#company statistic pie chart                    
# @modDashboard.route('/chrtForm', method="POST")
# @addHeaderDefault
# def chrtForm():
#     try:
#         connCtrl = Conn()
#         with connCtrl.getConn() as conn:
#             with conn.cursor() as cur:
#                 sql = """select endetail.des as label,count(member.id) as data from member 
#                         left join endetail on endetail.id = member.forms
#                         where endetail.iden=1 group by endetail.des """
#                 cur.execute(sql)
#                 rowHeaders = [x[0] for x in cur.description]
#                 result = cur.fetchall()
#             conn.commit()
#         connCtrl.close()
#         jsonData = []
#         for result in result:
#             jsonData.append(dict(zip(rowHeaders, result)))
#         return json.dumps({'s':0, 'd':jsonData})
#     except Exception as e:
#         logger.error(e)
#         return e


#>> pie chart angularjs version <<#
@modDashboard.route('/chrtForm', method="POST")
@addHeaderDefault
def chrtForm():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = """select count(member.id) as data from member 
                         left join endetail on endetail.id = member.forms
                         where endetail.iden=1 group by endetail.des"""
                cur.execute(sql)
                # rH = [x[0] for x in cur.description]
                result = cur.fetchall()
            con.commit()
        connCtrl.close()
        jD = []
        lbel = lblPieChart()
        
        for r in result:
            jD.append(r[0])
            z = jD
            percentage = sum(jD)
            p = int(percentage)   
        a = []
        for x in z:
            a.append(int((x/p)*100))
            # b = str(a+'%')
            # r = list(map("{}%".format, a))
        return json.dumps({'s':0, 'd':jD, 'label':lbel, 'per':a})
  
                
    except Exception as e:
        logger.error(e)
        return e
    
def lblPieChart():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = "select des from endetail where iden=1 group by des"
                # intp = (1,)
                cur.execute(sql)
                # rh = [x[0] for x in cur.description]
                result = cur.fetchall()
            con.commit()
        connCtrl.close()
        jD = []
        for r in result:
            jD.append(r[0])
        return jD
    except Exception as e:
        logger.error(e)
        return e
        
# def percent():
#     pass



    
#count this month new member kadin_pusat dashboard
@modDashboard.route('/infMemb', method="POST")
@addHeaderDefault
def infMemb():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "SELECT count(id) as newComer from member where date_trunc('month', regdate) >= date_trunc('month', CURRENT_DATE)"
                cur.execute(sql)
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        totMemb = totalMemb()
        nonActive = inactive()
        for result in result:
            jsonData.append(dict(zip(rowHeaders, result)))
        return json.dumps({'s':0, 'd':jsonData, 'tM':totMemb,'inactive':nonActive})
    except Exception as e:
        logger.error(e)
        return e

#count total member kadin_pusat dashboard  
def totalMemb():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select count(id) as Total_Member from member where status < 8 and status >= 4"
                cur.execute(sql)
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        return result[0]
    except Exception as e:
        logger.error(e)
        return e
    
#count member inactive kadin_pusat dashboard
def inactive():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select count(id) as inactive from kta where active=%s"
                intp= (0,)
                cur.execute(sql,intp)
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        return result[0]
    except Exception as e:
        logger.error(e)
        return e
    
## --------------------------- End Menu Dashboard Kadin_Pusat -------------------------------------##


## --------------------------- Menu National Register Kadin Pusat -------------------------------------##


# line chart function list nr
@modDashboard.route('/lnchrt', method="POST")
@addHeaderDefault
def lnChrt():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = '''select 
                    coalesce(nr, 0) as nr
                    from
                    (select cast(TO_CHAR((current_date - interval '1 month' * mastmonth),'MM') as integer) as months 
                    from generate_series(1,60,1) AS mastmonth group by months order by months asc) as ms
                    left join 
                    (select count(vas.id) as nr ,EXTRACT(MONTH FROM vdate) as months,EXTRACT(YEAR FROM vdate) as years from validations as vas
                    left join member as c on vas.idmember = c.id
                    where note = 'Request NR'
                    and EXTRACT(YEAR FROM vdate) = EXTRACT(YEAR FROM CURRENT_DATE) group by months, years) as b 
                    on b.months = ms.months
                    '''
                #sql = """select to_char(regdate, 'MONTH') as month, 
                #        count(id) as regnum from member
                #        where nasionalnum is not null group by month"""
                cur.execute(sql)
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        getnr = []
        x = 0
        for result in result:
            jsonData.append(dict(zip(rowHeaders,result)))
        for nr in jsonData:
            getnr.append(jsonData[x]['nr'])
            x += 1
        requestNr = reqNr()
        totalnr = sum(getnr)
        # for result in result:
        #     jsonData.append(dict(zip(rowHeaders,result)))
        return json.dumps({'s':0, 'd':getnr,'sum': totalnr, 'rNR':requestNr})
    except Exception as e:
        logger.error(e)
        return e

#------------------------------------ line chart for reequest nasional number ------------------------#
@modDashboard.route('/lnchrtrequest', method="POST")
@addHeaderDefault
def lnchrtrequest():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = '''select 
                    coalesce(nr, 0) as nr
                    from
                    (select cast(TO_CHAR((current_date - interval '1 month' * mastmonth),'MM') as integer) as months 
                    from generate_series(1,60,1) AS mastmonth group by months order by months asc) as ms
                    left join 
                    (select count(vas.id) as nr ,EXTRACT(MONTH FROM rdate) as months,EXTRACT(YEAR FROM rdate) as years from validations as vas
                    left join member as c on vas.idmember = c.id
                    where note = 'Request NR'
                    and EXTRACT(YEAR FROM rdate) = EXTRACT(YEAR FROM CURRENT_DATE) group by months, years) as b 
                    on b.months = ms.months
                    '''
                cur.execute(sql)
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        getnr = []
        x = 0
        for result in result:
            jsonData.append(dict(zip(rowHeaders,result)))
        for nr in jsonData:
            getnr.append(jsonData[x]['nr'])
            x += 1
        requestNr = reqNr()
        totalnr = sum(getnr)
        return json.dumps({'s':0, 'd':getnr,'sum': totalnr, 'rNR':requestNr})
    except Exception as e:
        logger.error(e)
        return e

    
def reqNr():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select count(id) as req_nr from validations where note =%s"
                intp = ('Request NR',)
                cur.execute(sql,intp)
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        return result[0]
    except Exception as e:
        logger.error(e)
        return e




## --------------------------- Menu Master Data Province & District Kadin Pusat -------------------------------------##

@modDashboard.route('/mdP', method="POST")
@addHeaderDefault
def mdP():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select id, provin as Provinces, description, active  from provin"
                cur.execute(sql)
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        district = mdDist()
        for result in result:
            jsonData.append(dict(zip(rowHeaders, result)))
        return json.dumps({'s':0, 'd':jsonData, 'dist':district})
    except Exception as e:
        logger.error(e)
        return e
        

def mdDist():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select city.id as distric_id,city, description,city.active as active_city from city left join provin on city.idprov = provin.id"
                cur.execute(sql)
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        for result in result:
            jsonData.append(dict(zip(rowHeaders, result)))
        return jsonData
    except Exception as e:
        logger.error(e)
        return e
    

@modDashboard.route('/updt', method='POST')
@addHeaderDefault
def updProv ():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "update provin set active = %s where id = %s"
                intp = (data['stat'],data['id'])
                cur.execute(sql,intp)
            conn.commit()
        connCtrl.close()
        return json.dumps({'s':0}) 
    except Exception as e:
        logger.error(e)
        return e

@modDashboard.route('/updtCity', method='POST')
@addHeaderDefault
def updCity():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "update city set active = %s where id = %s"
                intp = (data['status'],data['idcity'])
                cur.execute(sql,intp)
            conn.commit()
        connCtrl.close()
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e)
        return e
    

## --------------------------- Menu Organizers Kadin Pusat -------------------------------------##
## Get Data For table in organizers setting & organizers list

@modDashboard.route('/organizers', method='POST')
@addHeaderDefault
def orgset():
    try:
        connCtrl = Conn ()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select id,title, short_title,description,status from pjabatan where status='aktif'"
                cur.execute(sql)
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData =[]
        organizers_list = orglist()
        paren = par()
        posisi = pos()
        typess = types()
        for result in result:
            jsonData.append(dict(zip(rowHeaders,result)))
        return json.dumps({'s':0, 'orgset':jsonData, 'orgalist':organizers_list, 'parent':paren, 'position':posisi, 'tip':typess})
    except Exception as e:
        logger.error(e)
        return e

#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> end <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

# >>>>>>>>>>>>>>>>>>>>>>>>>>>> select box type function in organizer setting menu edit <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< #
def types():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = " select * from level "
                cur.execute(sql)
                rH = [x[0] for x in cur.description]
                result = cur.fetchall()
            con.commit()
        connCtrl.close()
        jsonData = []
        for r in result:
            jsonData.append(dict(zip(rH,r)))
        return jsonData #json.dumps({'s':0, 'tipe':jsonData[0]})
    except Exception as er:
        logger.error(er)
        return er

def typesByid(x):
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = " select level.* from level left join pjabatan on cast(pjabatan.territory as smallint) = level.id where pjabatan.id = %s "
                intp = (x,)
                cur.execute(sql, intp)
                rH = [x[0] for x in cur.description]
                result = cur.fetchall()
            con.commit()
        connCtrl.close()
        jsonData = []
        for r in result:
            jsonData.append(dict(zip(rH,r)))
        return jsonData
    except Exception as er:
        logger.error(er)
        return er
# >>>>>>>>>>>>>>>>>>>>>>>>>>>> End select box type function in organizer setting menu edit <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< #

#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Edit & Update Organizers set function <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
@modDashboard.route('/editOrgSet', method='POST')
@addHeaderDefault
def editOrgSet(): #edit organizers set
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select id, title, short_title, description, status, parent,territory from pjabatan where id=%s and status ='aktif'"
                intp = (data['ide'],)
                cur.execute(sql,intp)
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        for result in result:
            jsonData.append(dict(zip(rowHeaders, result)))
        parents = parbyid(jsonData[0]['parent'])
        typpe = typesByid(jsonData[0]['id'])
        return json.dumps({'s':0, 'data':jsonData[0], 'par':parents, 'typpess' :typpe})
    except Exception as e:
        logger.error(e)
        return e
  ##  end function edit menu organizers set
      
            
 ## function update menu organizers set
@modDashboard.route('/updateOrgSet', method='POST')
@addHeaderDefault
def updateOrgSet():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "update pjabatan set title=%s, parent=%s, short_title=%s,description = %s, territory=%s where id = %s and status ='aktif'"
                intp = (data['title'],data['parent']['id'], data['short_title'], data['description'], data['level']['id'], data['id'])
                cur.execute(sql,intp)
                # rH = [x[0] for x in cur.description]
                # result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        # jD = []
        # for r in result:
        #     jD.append(dict(zip(rH, r)))
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e)
        return json.dumps({'s':1})
    
 ## End function update menu organizers set
 #>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END Edit & Update Organizers set function <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

 

## --------------------------- Menu Organizers list Kadin Pusat -------------------------------------##
# >> Get data organizers list
def orglist():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = """select pengurus.id, name, email, address,pjabatan.title as position 
                     from pengurus left join pjabatan on pengurus.position = pjabatan.id"""
                cur.execute(sql)
                rowHeaders = [x[0]for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        for result in result:
            jsonData.append(dict(zip(rowHeaders, result)))
        return jsonData
    except Exception as e:
        logger.error(e)
        return e
    
    
def par():  
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select id,title from pjabatan where status != 'aktif'"
                cur.execute(sql)
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        for result in result:
            jsonData.append(dict(zip(rowHeaders, result)))
        return jsonData
    except Exception as e:
        logger.error(e)
        return e
    

def parbyid(x):  
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select id,title from pjabatan where id=%s and status != 'aktif'"
                cur.execute(sql,(x,))
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        for result in result:
            jsonData.append(dict(zip(rowHeaders, result)))
        return jsonData
    except Exception as e:
        logger.error(e)
        return e

def pos():
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select id, title from pjabatan where status != 'parent'"
                cur.execute(sql)
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        for result in result:
            jsonData.append(dict(zip(rowHeaders, result)))
        return jsonData
    except Exception as e:
        logger.error(e)
        return e
    

    
## --------------------------- End Menu Organizers list Kadin Pusat -------------------------------------##


# >>>>>>>>>>>> Edit organzers list function <<<<<<<<<<<<<<<<<<<<
@modDashboard.route('/orgListEdit', method='POST')
@addHeaderDefault
def orgListEdit():
    response.content_type = CONTENT_TYPE_JSON 
    data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select id, name, email, address, description, position  from pengurus where pengurus.id = %s"   
                intp = (data['idnum'],)
                cur.execute(sql,intp)
                rH = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        for r in result:
            jsonData.append(dict(zip(rH, r)))
        positions = posbyId(jsonData[0]['position'])
        return json.dumps({'s':0, 'd':jsonData[0], 'pos':positions})
    except Exception as e:
        logger.error(e)
        return e

def posbyId(y):
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "select id, title from pjabatan where id=%s and status != 'parent'"
                cur.execute(sql, (y,))
                rowHeaders = [x[0] for x in cur.description]
                result = cur.fetchall()
            conn.commit()
        connCtrl.close()
        jsonData = []
        for result in result:
            jsonData.append(dict(zip(rowHeaders, result)))
        return jsonData
    except Exception as e:
        logger.error(e)
        return e
    
@modDashboard.route('/updateOrgList', method='POST')
@addHeaderDefault
def updateOrgList():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "update pengurus set name =%s, email=%s, address= '%s', description='%s', position = %s where id = %s"
                intp = (data['name'],data['address'],data['email'],data['descriptions'],data['position']['id'],data['id'])
                cur.execute(sql,intp)
            conn.commit()
        connCtrl.close()
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e)
        return json.dumps({'s':1})
    
# >>>>>>>>>>>>>>>>>>>>>>>>>>>> adding function in organizer setting menu edit <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< #


@modDashboard.route('/addOrgSet', method='POST')
@addHeaderDefault
def addOrgSet():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = """insert into pjabatan (title, short_title,parent,description,territory, status)
                        values (%s, %s ,%s,%s,%s)"""
                intp = (data['title'], data['short_title'], data['parent']['id'],data['description'], data['level']['id'], 'aktif')
                cur.execute  (sql, intp)
            con.commit()
        connCtrl.close()
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e)
        return json.dumps({'s':1})
    
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> end function adding in organizer setting menu edit <<<<<<<<<<<<<<<<<<<<<<<#

#xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx adding function in organizer setting list edit xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#

@modDashboard.route('/addOrgList', method='POST')
@addHeaderDefault
def addOrgList():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = """insert into pengurus (name,email, address,description,position)
                        values (%s,%s,%s,%s,%s)"""
                intp = (data['name'], data['email'],data['address'],data['description'],data['position']['id'])
                cur.execute(sql,intp)
            con.commit()
        connCtrl.close()
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e)
        return json.dumps({'s':1})
    

#>>>>>>>>>>>>>>>>>>>>>>>>> function delete for organizer Set <<<<<<<<<<<<<<<<<<<<<<<
@modDashboard.route('/delSet', method='POST')
@addHeaderDefault
def delSet():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = "delete from pjabatan where id = %s"
                intp = (data['ds'],)
                cur.execute(sql,intp)
            con.commit()
        connCtrl.close()
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e)
        return json.dumps({'s':1})


#>>>>>>>>>>>>>>>>>>>>>>>>> function delete for organizer list <<<<<<<<<<<<<<<<<<<<<<<<#
@modDashboard.route('/delList',method='POST')
@addHeaderDefault
def delList():
    response.content_type = CONTENT_TYPE_JSON
    data = request.json
    try:
        connCtrl = Conn()
        with connCtrl.getConn() as con:
            with con.cursor() as cur:
                sql = "delete from pengurus where id = %s"
                intp = (data['dL'],)
                cur.execute(sql,intp)
            con.commit()
        connCtrl.close()
        return json.dumps({'s':0})
    except Exception as e:
        logger.error(e)
        return json.dumps({'s':1})
    