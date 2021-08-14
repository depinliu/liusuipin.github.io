#!/usr/bin/python3
# mod : API lib
# cre : lwx 20180428
# upd : lwx 20191015
# ver : 1.0

import bottle
from bottle import Bottle, route, run, get, post, put, delete, error, request, response
from datetime import datetime
#import rethinkdb as r
#import pymysql
import locale
import base64
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import config, HEADER_X_A, PRODUCT_ID

CONTENT_TYPE_JSON = 'application/json'

#def connection():
#    return r.connect(host=config('r_host'), port=config('r_port'), db=config('r_db')).repl()


#def mariaConnection():
#    return pymysql.connect(host=config('maria_host'), port=config('maria_port'), user=config('maria_user'), passwd=config('maria_password'), db=config('maria_db'))

def stringToBase64(s):
    return base64.b64encode(s.encode('utf-8'))

def base64ToString(b):
    return base64.b64decode(b).decode('utf-8')

#default get header 'X-A'
def getRequestHeader(oReq, header=HEADER_X_A):
    try:
        return oReq.headers[header]
    except:
        return None

#default get client ip
def getRequestEnv(oEnv, name='HTTP_X_FORWARDED_FOR', nameAlias='REMOTE_ADDR'):
    try:
        return oEnv.get(name) or oEnv.get(nameAlias)
    except:
        return None

def getAllRequestEnv(oEnv):
    env = {}
    obj=list(oEnv)
    for i in obj:
        try:
            s = oEnv.get(i.upper())
            if s != "" and s != None:
                env[i] = s
        except:
            env[i] = 'ERR'
    return env

def loadHtmlEmailTemplate(fileName, placeHolders, replacements):
    # load html template
    cdef int tb, te
    cdef str body, subject
    body = open(fileName, 'r').read()
    # replacing place holders
    body = _processPlaceHolder(body, placeHolders, replacements)
    subject = ''
    # get subject from <title>
    tb = body.find('<title>')
    if tb > 0:
        tb += 7
        te = body.find('</title>')
        if te > 0:
            subject = body[tb:te]
    return (subject, body)

# # send email sample:
# (subject, body) = loadHtmlEmailTemplate("template/member_invitation.html",
# ['%dn%', '%newPass%', '%url%','%toEmail%', '%first_name%', '%last_name%', '%username%'],
# [config('base_url'), default_pass, config('base_url')+ '#/user/sign-in', email, first_name, last_name, email])
# sendMail(email, config('sender_email'), subject, body)

def sendMail(recipient, sender, subject, htmlBody):
    server = smtplib.SMTP(config('smtp_host'), port=config('smtp_port'))
    server.starttls()
    server.ehlo()
    server.login(config('smtp_username'), config('smtp_password'))

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = sender

    if isinstance(recipient, list):
        msg['To'] = ','.join(recipient)
    else:
        msg['To'] = recipient

    htmlPart = MIMEText(htmlBody, 'html')

    # Attach parts into message container.
    # According to RFC 2046, the last part of a multipart message, in this case
    # the HTML message, is best and preferred.
    msg.attach(htmlPart)

    server.sendmail(sender, recipient, msg.as_string())
    server.quit()

def rand(seed):
    cdef int m = 255, a = 11, c = 17
    return (a * seed + c) % m


def inscribe(s):
    cdef int key, i, j
    cdef str retval
    retval = ''
    key = 56
    for c in s:
        key = rand(key)
        i = ord(c)
        j = i ^ key
        retval += chr(j)
    return retval


def flattenJson(jsonDoc, keyName):
    retval = []
    for item in jsonDoc:
        retval.append(item[keyName])
    return retval


def unFlattenJson(jsonDoc, keyName):
    retval = []
    for item in jsonDoc:
        retval.append({keyName: item})
    return retval


# Decorators
def addHeaderDefault(fn):
    def _addHeaderDefault(*args, **kwargs):
        response.headers['Cache-Control'] = 'no-cache'
        response.headers['Server'] = PRODUCT_ID
        if bottle.request.method == 'OPTIONS':
            return ""
        else:
            # actual request; reply with the actual response
            return fn(*args, **kwargs)
    return _addHeaderDefault

def enable_cors(fn):
    def _enable_cors(*args, **kwargs):
        # set CORS headers
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Authorization, Content-Type, X-Requested-With, X-Token, X-TknSkpExp'
        response.headers['Access-Control-Max-Age'] = '1728000'
        response.headers['Cache-Control'] = 'no-cache'
        response.headers['Server'] = PRODUCT_ID
        if bottle.request.method == 'OPTIONS':
            return ""
        else:
            # actual request; reply with the actual response
            return fn(*args, **kwargs)
    return _enable_cors

# def auth_check(fn):
#     def _auth_check(*args, **kwargs):
#         if not 'X-Token' in request.headers:
#             return {'status': '257', 'error': 'Token is required'}
#         else:
#             token = request.headers['X-Token']
#             result = list(r.table('user').get_all(token, index='token').pluck(
#                 'id', 'token_date_created').run(bottle.local.conn))
#             if len(result) == 0:
#                 return {'status': '258', 'error': 'Invalid token'}
#             if 'token_date_created' in result[0]:
#                 skipTokenExpCheck = False
#                 if 'X-TknSkpExp' in request.headers:
#                     if request.headers['X-TknSkpExp'] == '1':
#                         skipTokenExpCheck = True
#                 if not skipTokenExpCheck:
#                     tokenPeriod = (
#                         r.now() - result[0]['token_date_created']).run(bottle.local.conn)
#                     if tokenPeriod > config('token_expire_period'):
#                         return {'status': '259', 'error': 'Token expires'}
#             return fn(*args, **kwargs)
#     return _auth_check


def getPagingIndex(query, count, limit=10):
    cdef b, p, lp, stopIdx, startIdx
    # b=button: 0=first page, 1=previous page, 2=next page, 3=last page
    try:
        b = int(query.b)
    except:
        b = -1
    # p=page
    try:
        p = int(query.p)
    except:
        p = 1
    try:
        limit = int(query.l)
    except:
        pass
    # count total page
    if count > 0:
        lp = count // limit
        if (count % limit) > 0:
            lp += 1
    else:
        lp = 0
    if b == 0:
        p = 1
    elif b == 1:
        if p > 1:
            p -= 1
    elif b == 2:
        p += 1
        if p > lp:
            p = lp
    elif b == 3:
        p = lp
    stopIdx = p * limit
    startIdx = stopIdx - limit
    if b == -1:
        return (startIdx, stopIdx)
    else:
        return (p, startIdx, stopIdx, "Page " + str(p) + " of " + str(lp))


def getPagingCalculation(query, count, limit=10):
    cdef int rem, div, page
    cdef str ld, firstPage, previousPage, nextPage, lastPage
    try:
        limit = int(query.l)
    except:
        pass
    ld = "&l=" + str(limit)
    firstPage = "p=1" + ld
    previousPage = ""
    nextPage = ""
    lastPage = ""
    rem = count % limit
    div = count // limit
    page = 0
    try:
        if page == 1:
            previousPage = firstPage
        else:
            previousPage = "p=" + str(page - 1) + ld
    except:
        previousPage = ""
    try:
        if rem == 0:
            lastPage = "p=" + str(div) + ld
        else:
            lastPage = "p=" + str(div + 1) + ld
    except:
        lastPage = ""
    try:
        if page >= div:
            nextPage = lastPage
        else:
            nextPage = "p=" + str(page + 1) + ld
    except:
        nextPage = ""
    return (firstPage, previousPage, nextPage, lastPage)


# def getCreatorInfo(creaBy, conn, logger):
#     (f0, f1, f2) = ('first_name', 'last_name', 'profile_pic')
#     try:
#         qry = r.table("user").get(creaBy).pluck(f0, f1, f2)
#         res = qry.run(conn, time_format='raw')
#         if f0 not in res:
#             res[f0] = ''
#         if f1 not in res:
#             res[f1] = ''
#         if f2 not in res:
#             res[f2] = ''
#         # print({f0: res[f0], f1: res[f1], f2: res[f2]})
#         return {f0: res[f0], f1: res[f1], f2: res[f2]}
#     except Exception as e:
#         logger.error(e, exc_info=True)
#         return {f0: '', f1: '', f2: ''}


def logErrReturnJSON(logger, status, err, modFunc=None, arg=None):
    log = {}
    if modFunc:
        log["mod"] = modFunc
    if arg:
        log["arg"] = arg
    log["s"] = status
    log["e"] = err
    logger.error(log, exc_info=True)
    return json.dumps(log)

# def loadHtmlEmailTemplate(fileName, placeHolders, replacements):
#     # load html template
#     body = open(fileName, 'r').read()
#     # replacing place holders
#     body = _processPlaceHolder(body, placeHolders, replacements)
#     subject = ''
#     # get subject from <title>
#     tb = body.find('<title>')
#     if tb > 0:
#         tb += 7
#         te = body.find('</title>')
#         if te > 0:
#             subject = body[tb:te]
#     return (subject, body)

def _processPlaceHolder(template, placeHolders, replacements):
    cdef int length, i
    length = len(placeHolders)
    for i in range(0, length):
        template = template.replace(placeHolders[i], replacements[i])
    return template


# [[k,v],[k,v]] >> [{k:k, v:v},{k:k, v:v}]
def arr2KeyVal(arr):
    arr2=[]
    for a in arr:
        arr2.append({"k":a[0],"v":a[1]})
    return arr2

def formatIDR(angka, with_prefix=False, desimal=2):
    locale.setlocale(locale.LC_NUMERIC, 'id_ID.UTF-8')
    #locale.setlocale(locale.LC_NUMERIC, 'IND')
    rupiah = locale.format("%.*f", (desimal, angka), True)
    if with_prefix:
        return "Rp. {}".format(rupiah)
    return rupiah

def formatDateIND(tanggal):
    locale.setlocale(locale.LC_TIME, 'id_ID.UTF-8')
    dateindo = datetime.strftime(tanggal,"%A, %d %B %Y %H:%M")
    return dateindo