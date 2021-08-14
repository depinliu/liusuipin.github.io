#!/usr/bin/python3
# mod : Messaging module
# cre : lwx 20210126
# upd : lwx 20210126
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

modMsg = Bottle()
#logging.config.fileConfig('logging.conf')
logger = logging.getLogger()

_ROUTE_GET = ["OPTIONS", "GET"]
_ROUTE_POST = ["OPTIONS", "POST"]

# msggrp:
#     id: uuid
#     name: string
#     img: string
#     creator: _g.id
#     adm: [ _g.id ]
#     member: [ _g.id ]

# msg:
#     id: uuid
#     typ: number: # msg type:
#                  1:text msg; 2:picture msg; 3:video msg;
#                  128:msg to all flag; 129:upd status; 130:upd profile pic;
#                  256:ctrl flag; 257:create grp; 258:chg grp info; 259:left grp; 260:add member to grp;
#                  261:adm del member from grp; 262:adm promote member to adm; 263:adm demote adm to member;
#     dt: datetime     # message datetime
#     msg: string      # string message
#     obj: obj         # additional msg if string not adequate
#     fr: _g.id        # userId who sent the msg
#     tou: [_g.id]     # to user(s) who the msg intented to;
#     tog: [msggrp.id] # to group(s) who the msg intented to;
# # set both tou & tog null if send to all such as msg type 2 & 3

#TODO: create chat group
@modMsg.route("/msg/g/c", method=_ROUTE_POST) # chat grp create
@addHeaderDefault
def msgCreaGrp():
    response.content_type = CONTENT_TYPE_JSON
    try:
        sesionId = getRequestHeader(request)
        doc = request.json
        userId = "LISUYANTO@YAHOO.COM" #TODO:get user id here
        with Conn() as conn:
            ret = conn.insert(userId, "msggrp", doc)
        return json.dumps({"$": 0, "_": ret}, default=str)
    except Exception as e:
        return logErrReturnJSON(logger, -1, e, "modMsg.msgCreaGrp")

#TODO: Chat edit group name and img
updateByKey(self, UserId, tbName, key, data)
@modMsg.route("/chat/g/e", method=_ROUTE_POST) # chat grp edit
@addHeaderDefault
def msgEditGrp():
    response.content_type = CONTENT_TYPE_JSON
    try:
        sesionId = getRequestHeader(request)
        doc = request.json
        userId = "LISUYANTO@YAHOO.COM" #TODO:get user id here
        with Conn() as conn:
            ret = conn.updateByKey(userId, "msggrp", doc["id"], doc["msg"])
        return json.dumps({"$": 0, "_": ret}, default=str)
    except Exception as e:
        return logErrReturnJSON(logger, -1, e, "modMsg.msgEditGrp")

#TODO: admin add member to group

#TODO: Post text message to user or to group
@modMsg.route("/chat/m/c", method=_ROUTE_POST) # chat msg create
@addHeaderDefault
def msgTxt():
    response.content_type = CONTENT_TYPE_JSON
    try:
        sesionId = getRequestHeader(request)
        doc = request.json
        userId = "LISUYANTO@YAHOO.COM" #TODO:get user id here
        with Conn() as conn:
            ret = conn.insert(userId, "msg", doc)
        return json.dumps({"$": 0, "_": ret}, default=str)
    except Exception as e:
        return logErrReturnJSON(logger, -1, e, "modMsg.msgTxt")

#TODO: Upload picture and return picture id, after that user can call post picture msg

#TODO: Post picture message to user or to group

#TODO: Upload video and return video id, after that user can call post video msg

#TODO: Post video message to user or to group

#TODO: Post status update

#TODO: Post profile pic update

#TODO: Post left grp
#TODO: Post add member to grp
#TODO: Post add member to grp
#TODO: adm del member from grp
#TODO: adm promote member to adm
#TODO: adm demote adm to member

#TODO: Get my msg
