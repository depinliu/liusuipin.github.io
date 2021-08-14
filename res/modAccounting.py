#!/usr/bin/python3
# mod : Accounting module
# cre : lwx 20190926
# upd : lwx 20191016
# ver : 1.0

import bottle
from bottle import Bottle, route, run, get, post, put, delete, error, request, response
import json
from lib import CONTENT_TYPE_JSON, enable_cors, logErrReturnJSON, addHeaderDefault, getRequestHeader, getRequestEnv
#from random import randint,choice
#import hashlib
#import ed
from dbr import Conn
from rethinkdb import r
import logging
#import logging.config
#from PIL import Image, ImageDraw, ImageFont#, ImageTk
#from datetime import datetime #, timezone, timedelta
from config import HEADER_X_A #= "XA"

modAccounting = Bottle()
#logging.config.fileConfig('logging.conf')
logger = logging.getLogger()

_ROUTE_GET = ["OPTIONS", "GET"]
_CONN = "conn_gacc"

@modAccounting.route("/accounting/coa/l", method=_ROUTE_GET)
@addHeaderDefault
def cOAList():
    response.content_type = CONTENT_TYPE_JSON
    try:
        sesionId = getRequestHeader(request)
        with Conn(_CONN) as conn:
            ret = conn.getMany("coa", None, "id")
        return json.dumps({"$": 0, "_": ret}, default=str)
    except Exception as e:
        #logger.debug("7")
        return logErrReturnJSON(logger, -1, e, "modAccounting.cOAList")

#list all journal template
@modAccounting.route("/accounting/journal/t/l", method=_ROUTE_GET)
@addHeaderDefault
def listJournalTmpl():
    response.content_type = CONTENT_TYPE_JSON
    try:
        sesionId = getRequestHeader(request)
        with Conn(_CONN) as conn:
            ret = conn.getMany("journalt", None, None)
        return json.dumps({"$": 0, "_": ret}, default=str)
    except Exception as e:
        #logger.debug("7")
        return logErrReturnJSON(logger, -1, e, "modAccounting.getJournalTmpl", {"tid": tid})

@modAccounting.route("/accounting/journal/t/g/<tid>", method=_ROUTE_GET)
@addHeaderDefault
def getJournalTmpl(tid):
    response.content_type = CONTENT_TYPE_JSON
    try:
        sesionId = getRequestHeader(request)
        with Conn(_CONN) as conn:
            ret = conn.getByKey("journalt", tid)
        return json.dumps({"$": 0, "_": ret}, default=str)
    except Exception as e:
        #logger.debug("7")
        return logErrReturnJSON(logger, -1, e, "modAccounting.getJournalTmpl", {"tid": tid})
