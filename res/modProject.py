#!/usr/bin/python3
# mod : Authentication module
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

modProject = Bottle()
#logging.config.fileConfig('logging.conf')
logger = logging.getLogger()

_ROUTE_GET = ["OPTIONS", "GET"]

# #region option
# #@modProject.route("/project/l/<limit:int>", method="OPTIONS")
# @modProject.route("/project/l/<limit:int>/<idx:int>", method="OPTIONS")
# @enable_cors
# def _():
#     return ''
# #endregion option

# error if a lot of record with the same name
# @modProject.route("/project/l/<limit:int>", method="GET")
# @modProject.route("/project/l/<limit:int>/<pName>", method="GET")
# @addHeaderDefault
# def projectList(limit, pName=None):
#     response.content_type = CONTENT_TYPE_JSON
#     try:
#         sesionId = getRequestHeader(request)
#         #limit = limit or 10
#         with Conn().getConn() as conn:
#             qry = r.table("p0")
#             logger.debug(pName)
#             if pName:
#                 #logger.debug(pName)
#                 qry = qry.between(pName, r.maxval, left_bound="open", index="name")
#             ret = list(qry.order_by(index="name").limit(limit).run(conn, time_format="raw"))
#             #print(rec)
#             #logger.debug(rec)
#         #logger.debug({"s": 0, "d": ret})
#         #return status to client
#         return json.dumps({"s": 0, "d": ret})
#     except Exception as e:
#         #logger.debug("7")
#         return logErrReturnJSON(logger, "-1", e)

#@modProject.route("/project/l/<limit:int>", method="GET")
@modProject.route("/project/l/<limit:int>/<offset:int>", method=_ROUTE_GET)
@addHeaderDefault
def projectList(limit, offset=0):
    response.content_type = CONTENT_TYPE_JSON
    try:
        sesionId = getRequestHeader(request)
        # #limit = limit or 10
        # with Conn().getConn() as conn:
        #     qry = r.table("p0").order_by("name")
        #     if offset==0:
        #         #logger.debug(pName)
        #         qry = qry.limit(limit)
        #     else:
        #         qry = qry.slice(offset,offset+limit)
        #     ret = list(qry.run(conn, time_format="raw"))
        #     #print(rec)
        #     #logger.debug(rec)
        # #logger.debug({"s": 0, "d": ret})
        # #return status to client
        with Conn() as conn:
            ret = conn.getPaging("p0", limit, offset, "name")
        return json.dumps({"$": 0, "_": ret}, default=str)
    except Exception as e:
        #logger.debug("7")
        return logErrReturnJSON(logger, -1, e, "modProject.projectList", {"limit": limit, "offset": offset})