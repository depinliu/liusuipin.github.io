#!/usr/bin/python3
# mod : Authentication module
# cre : lwx 20190926
# upd : lwx 20191016
# ver : 1.0

import bottle
from bottle import Bottle, route, run, get, post, put, delete, error, request, response
import json
from lib import CONTENT_TYPE_JSON, enable_cors, logErrReturnJSON, addHeaderDefault, getRequestHeader, getRequestEnv
from random import randint,choice
import hashlib
import ed
from dbr import Conn
from rethinkdb import r
import logging
#import logging.config
from PIL import Image, ImageDraw, ImageFont#, ImageTk
from datetime import datetime, timezone#, timedelta
from config import HEADER_X_A #= "XA"

modAuth = Bottle()
logger = logging.getLogger()

# #region option
# @modAuth.route('/auth/c/<uuid>', method='OPTIONS')
# @modAuth.route('/x/<no>', method='OPTIONS')
# @modAuth.route('/auth/l', method='OPTIONS')
# @enable_cors
# def _():
#     return ''
# #endregion option

def _sessionId(sesionId=None):
    #key = ed.genKey(5)
    if sesionId == None: #create new session id
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                isLoop = True
                while isLoop:
                    #sesionId = ed.BN(key).ToBaseN(uuid.uuid4().__int__())
                    sesionId=ed.sessionId()
                    sesionId += ed.hashSId(sesionId, LWX, PRODUCT_ID)
                    sql = "SELECT r FROM l0 WHERE s=%s ORDER BY i DESC LIMIT 1;"
                    cur.execute(sql, (sesionId,))
                    if cur.fetchone() == None:
                        isLoop = False
        connCtrl.close()
        #sesionId = en.BN(key).ToBaseN(uuid.uuid4().__int__())
        #return sesionId + ed.hashSId(sesionId, key, LWX, PRODUCT_ID)(sesionId)
        return sesionId
    else: #verify whether session id valid
        if sesionId == "":
            return False
        if ed.isValidSId(sesionId, LWX, PRODUCT_ID):
            # harus cek ke db apakah ada session idnya
            return True
        else:
            return False

# Log Statistic
@modAuth.route('/h8ipt30yag9srdrlv1y6.lwx', method=["OPTIONS", "POST"])
@addHeaderDefault
def logStat():
    response.content_type = CONTENT_TYPE_JSON
    try:
        sesionId = getRequestHeader(request)
        # if sesionId == None:
        #     sesionId = _sessionId()
        #     # return encrypted session id through header X-A. Later on client send decrypted session id
        #     response.headers[HEADER_X_A] = ed.BNE(6, ed.genKey(2)).Enc(sesionId)
        doc = request.json
        # url = doc['a']
        clientIp = getRequestEnv(request.environ)
        #print(doc['a'],sesionId,clientIp,datetime.now())
        #rec = dict(url=doc['a'], header=request.headers, param=request.query, ip=clientIp, _d=datetime.now(timezone.utc), len=len(request.query))
        rec = dict(url=doc['a'], header=request.headers, param=request.query, ip=clientIp, len=len(request.query))
        if(sesionId):
            rec["_s"] = sesionId
        #save statistic to db here
        #connCtrl = Conn()
        # with Conn().getConn() as conn:
        #     ret=r.table("_b").insert(rec).run(conn)
        #     rec["ret"]=ret
        #     #print(rec)
        #     #logger.info(rec)
        with Conn() as conn:
            conn.insert(None,"_b", rec)
        #return status to client
        return json.dumps({"$": 0}, default=str)
    except Exception as e:
        return logErrReturnJSON(logger, -1, e, "modAuth.logStat")

# generate captcha image and save the info to db
@modAuth.route('/auth/c/<uuid>', method='GET')
@addHeaderDefault
def getCaptcha(uuid):
    if uuid == '':
        return ''
    try:
        # get sessionId, clientIp from header
        sessionId = getRequestHeader(request)
        clientIp = getRequestEnv(request.environ)
        #create secret captcha
        secret = ed.genRndWord()
        #save info to database
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                #check if sessionId in db
                sql = "SELECT u FROM l2 WHERE s=%s"
                cur.execute(sql, (sessionId,))
                if cur.fetchone() is None:
                    #insert new record
                    sql = "INSERT INTO l2(s,u,r,c,p)VALUES(%s,%s,%s,%s,%s);"
                    cur.execute(sql, (sessionId, uuid, datetime.now(), secret, clientIp))
                else:
                    #update record
                    sql = "UPDATE l2 SET u=%s,r=%s,c=%s,p=%s WHERE s=%s;"
                    cur.execute(sql, (uuid, datetime.now(), secret, clientIp, sessionId))
            conn.commit()
        connCtrl.close()
        #create captcha image
        base = Image.open('captcha/captchaBlank'+choice(['1','2','3','4'])+'.png').convert('RGBA')
        txt = Image.new('RGBA', base.size, (255, 255, 255, 0))
        # fnt = ImageFont.truetype('captcha/vineritc.ttf', 24)
        fnt = ImageFont.truetype('captcha/'+choice(['FreeMonoBold.ttf','vineritc.ttf']), 24)
        d = ImageDraw.Draw(txt)
        d.text((randint(10, 80), randint(5, 15)), secret, font=fnt, fill=(20, 60, 10, 155))
        out = Image.alpha_composite(base, txt)
        imgBuff = io.BytesIO()
        out.save(imgBuff, format='png')
        # closing io
        out.close()
        txt.close()
        base.close()
        # returning the image
        imgBuff.seek(0)
        response.content_type = 'image/png'
        return imgBuff.read()
    except Exception as e:
        logErrReturnJSON(logger, -1, e)
        return ''

#return default encryption body
#no: verification code
@modAuth.route('/x/<no>', method='GET')
@addHeaderDefault
def getLoginEncryption(no):
    # uuid "33017E31917B4BD6D8F17781D1B86E70" = base 10 "67798379592703650095778138539792297584" = base 40 url safe "h9pyg2fxh_u8wfd3c0.mgla1"
    #if dn in allowedClient() and no == 'h9pyg2fxh_u8wfd3c0.mgla1':
    try:
        sesionId = getRequestHeader(request) or "" #get default header: 'X-A'
        isSessionIdValid = _sessionId(sesionId)
        isNo = (no == 'h9pyg2fxh_u8wfd3c0.mgla1')
        clientIp = getRequestEnv(request.environ) #get default: client ip
        j = {'session': isSessionIdValid, 'key': isNo}
        if not (isSessionIdValid and isNo):
            j['env'] = _getAllRequestEnv(request.environ)
        #save client info here
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                sql = "INSERT INTO l0(r,s,u,p,j)VALUES(%s,%s,%s,%s,%s);"
                cur.execute(sql, (datetime.now(), sesionId, 'x/<no>', clientIp, json.dumps(j)))
            conn.commit()
        connCtrl.close()
        if isSessionIdValid and isNo: #return ecn func if request legit
            response.content_type = CONTENT_TYPE_TEXT
            response.headers[HEADER_X_A] = "$];J#cT@FD>#7&c+T1T%0%Z!K!(!1T&1P!$!2U!!=<!.&!5KQHT<*=<#G&?!2D#Q]=!2?!>P4J*_$5<D-^+MTX?$&E$!3IH#d4D$^=P!0+D!ZL9O1<PD.NUX+0O!!J+1&3;L0!>Fb#-%BD!=+))3!!2PD%21.G!3#TXU+><7S!!DP$]_._d9Ea#L5*5R3%UFAG,N5I=25D]R-NE!HLX!.50bD#0!-WA]D_L*2N&N+4dSS?R_(OL;S6_GH^B+!%-T1D!IP+b_1F<!.>)^=;TR.T,66KMJ<6d!*N]EF?LYF$]1!#87VcBJ.]!M.,>QE]0#=1DV$4K&!"
        else: #return Not found if request not legit
            logger.error(request.url+"==>" + " remote_addr:"+request.remote_addr + " remote_route:"+",".join(request.remote_route))
            abort(400)
        return '0'
    except Exception as e:
        logErrReturnJSON(logger, -1, e)
        return "-1"

#default hashing function
def _hash(sourceStr):
    return hashlib.sha1(bytes(LWX + sourceStr + PRODUCT_ID + PRODUCT,'utf7')).hexdigest()

#get session b128 encryption key
def _getSessionEncKey(cur, uId, sesionId):
    pass

#login
@modAuth.route("/auth/l", method='POST')
@addHeaderDefault
def doLogin():
    def _verifyCaptcha(cur, sesionId, cId, captcha):
        sql = "SELECT r,p,j FROM l2 WHERE s=%s AND u=%s AND c=%s;"
        cur.execute(sql, (sessionId, cId, captcha.upper()))
        return cur.fetchone()
    def _saveLoginResult(cur, loginResult, sessionId, clientIp, loginData, cId, userId=None):
        sql = "INSERT INTO l1(y,x,f,u,r,p,s,j)VALUES(%s,%s,%s,%s,%s,%s,%s,%s)RETURNING i;"
        j = {"u":loginData[0],"c":loginData[2], "g":cId}
        cur.execute(sql, (0, 0, loginResult, None, datetime.now(), clientIp, sessionId, json.dumps(j)))
        return ('{"s":%s}' % (loginResult), cur.fetchone()[0])
    def _verifyCredential(cur, captchaRec, sessionId, clientIp, loginData, cId):
        errNone = 0
        errCaptchExpire = 258
        errIp = 259
        errCredential = 260 #either or both user code and password incorrect
        if (datetime.now(timezone.utc)-timedelta(seconds=180)) > captchaRec[0]:
            #request captcha time until submit login taken too long, return errCaptchExpire
            (ret, recordId) = _saveLoginResult(cur, errCaptchExpire, sessionId, clientIp, loginData, cId)
        elif clientIp != captchaRec[1]:
            #ip not the same, how come ah? return errIp
            (ret, recordId) = _saveLoginResult(cur, errIp, sessionId, clientIp, loginData, cId)
        else:
            # check login credential
            #i=userId, p=m2.i people id, c=m3.i company id, f=flag, g=user picture file, d=userCode, h=password
            sql = "SELECT i,p,c,f,g FROM m1 WHERE d=%s AND h=%s ORDER BY v DESC LIMIT 1;"
            #hashing submitted pwd
            hashPwd = _hash(loginData[1])
            cur.execute(sql, (loginData[0].upper(), hashPwd))
            userRec = cur.fetchone()
            if userRec == None:
                # either user code or user password or both incorrect
                (ret, recordId) = _saveLoginResult(cur, errCredential, sessionId, clientIp, loginData, cId)
                #temporarry debug code
                ret = json.dumps({"s":errCredential, "h":hashPwd, "ld1":loginData[1]})
            else:
                #check for user flag, because user code and user password are both correct
                #0:active, 768:waiting verification, 769:must change pwd, 1023:deactivate by admin, 1022:too many wrong pwd
                uFlag = userRec[3]
                if uFlag == 0 or uFlag == 769: #0: user active, 769: must change password, else user inactive
                    (ret, recordId) = _saveLoginResult(cur, errNone, sessionId, clientIp, loginData, cId, userRec[0])
                    #generate b128 encryption key
                    key = ed.genKey(9)
                    #save key
                    #u=userId, l=l1.i(activity log id),r=time stamp, s=sessionId, k=key
                    sql = "INSERT INTO public.l3(u,l,r,s,k)VALUES(%s,%s,%s,%s,%s);"
                    cur.execute(sql, (userRec[0], recordId, datetime.now(), sessionId, key))
                    #probably should get detail user info in people table and company table
                    ret = json.dumps({"s":uFlag, "g":userRec[4], "a": ed.BNE(6, ed.genKey(2)).Enc(key)})
                else:
                    ret = '{"s":%s}' % (uFlag)
        return ret
    response.content_type = CONTENT_TYPE_JSON
    #errNone = 0         # declare at _verifyCredential
    errCaptcha = 257
    #errCaptchExpire = 2 # declare at _verifyCredential
    #errIp = 3           # declare at _verifyCredential
    try:
        doc = request.json
        loginData = json.loads(ed.ed(doc['a'], LWX, PRODUCT_ID + PRODUCT))
        sessionId = getRequestHeader(request)
        clientIp = getRequestEnv(request.environ)
        cId = doc['b']
        ret = ''
        connCtrl = Conn()
        with connCtrl.getConn() as conn:
            with conn.cursor() as cur:
                # first check captcha
                captchaRec = _verifyCaptcha(cur, sessionId, cId, loginData[2])
                if captchaRec == None:
                    # either sessionId, unique login id and captcha incorrect
                    # save the error login for analytic later on
                    (ret, recordId) = _saveLoginResult(cur, errCaptcha, sessionId, clientIp, loginData, cId)
                else:
                    # sessionId, unique login id and captcha correct,
                    # check time elapsed, ip and last credential
                    ret = _verifyCredential(cur, captchaRec, sessionId, clientIp, loginData, cId)
            conn.commit()
        connCtrl.close()
        return ret
    except Exception as e:
        return logErrReturnJSON(logger, -1, e)

# List Role
@modAuth.route('/a/r/l/<limit:int>/<offset:int>', method=["OPTIONS", "GET"])
@addHeaderDefault
def roleList(limit, offset=0):
    response.content_type = CONTENT_TYPE_JSON
    try:
        # sesionId = getRequestHeader(request)
        # if sesionId == None:
        #     sesionId = _sessionId()
        #     # return encrypted session id through header X-A. Later on client send decrypted session id
        #     response.headers[HEADER_X_A] = ed.BNE(6, ed.genKey(2)).Enc(sesionId)
        # clientIp = getRequestEnv(request.environ)
        # if(sesionId):
        #     rec["sId"] = sesionId
        with Conn() as conn:
            ret = conn.getPaging("_f", limit, offset, "id")
        return json.dumps({"$": 0, "_": ret}, default=str)
    except Exception as e:
        return logErrReturnJSON(logger, -1, e, "modAuth.roleList", {"limit": limit, "offset": offset})
