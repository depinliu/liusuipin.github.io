#!/usr/bin/python3
# mod : Handling rethinkdb connection
# cre : lwx 20200106
# upd : lwx 20201219
# ver : 1.1

import logging
#import logging.config
#from connstr import getConnStr
import config
import ed
from rethinkdb import r
import json
from datetime import datetime, timezone#, timedelta

logger = logging.getLogger()
#cdef str _cStr = ""
_connFile = ""
_connDt = None # = {
#                    "host": "",
#                    "port": "",
#                    "db": "",
#                    "user": "",
#                    "password": ""
#                }

# system table:
    # _a	Audit trail
    # _b	Browser statistic logging
    # _c	People
    # _d	Organization
    # _e	Enum
    # _f	Role
    # _g	User
    # _h	Feature
    # _i	Role-Feature
    # _j	Setting: system(id=_), user(id=user id)
    # _y	Captcha
    # _z	Session

# system field Name:
#     "_a" = action
#     "_t" = tbName
#     "_k" = key
#     "_u" = UserId
#     "_d" = datetime.now(timezone.utc)
#     "_r" = refKey
#     "_s" = session id

class Conn(object):
    def __init__(self, connFile="conn"): #, logger=None
        #cdef str s
        #self.logger = logger or logging.getLogger()
        self._Conn = None
        try:
            global _connDt
            global _connFile
            if _connDt==None or _connFile!=connFile:
                _connFile = connFile
                arr = [57, 89, 122, 32, 34, 21, 89, 80, 58, 64, 47, 46, 104, 122, 60, 78, 91, 21, 79, 3, 49, 19, 20, 69, 58, 20, 23, 31, 66, 46, 71, 51, 75, 6, 127, 29, 26, 54, 65, 31, 1, 24, 60, 90, 5, 115, 32, 53, 26, 48, 42, 20, 53, 47, 44, 104, 54, 81, 60, 102, 51, 91, 93, 28, 18, 22, 37, 5, 5, 18, 85, 5, 30, 38, 40, 33, 16, 59, 75, 76, 27, 50, 89, 80, 123, 59, 10, 52, 10, 87, 56, 7, 41, 68, 33]
                with open(connFile, "r") as f:
                    s = f.read()
                    cStr = s.translate(ed.trk(arr, config.LWX + config.PRODUCT_ID + config.PRODUCT))
                    #logger.info(cStr)
                    _connDt = json.loads(cStr)
        except Exception as e:
            logger.error({"mod":"Conn.__init__", "e":e})
    def __enter__(self):
        #logger.debug("Start connect to db")
        try:
            global _connDt
            #self._Conn = r.connect(host=_connDt['host'], port=_connDt['port'], db=_connDt['db'], user=_connDt['user'],password=_connDt['password']).repl()
            self._Conn = r.connect(**_connDt).repl()
            return self
        except Exception as e:
            logger.error({"mod":"Conn.__enter__", "e":e})
            return None
    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.close()
        if exc_type!=None or exc_value!=None or exc_traceback!=None:
            logger.info(dict(mod="Conn.__exit__", exc_type=exc_type, exc_value=exc_value, exc_traceback=exc_traceback))
    def getConn(self):
        if self._Conn is None:
            self.__enter__()
        return self._Conn
    def close(self):
        if self._Conn:
            #logger.debug("Closing connection to db")
            self._Conn.close()
    def checkCredential(self, featureId, UserId, action):
        # action: 1=addNew
        #         2=update
        #         4=delete
        #         8=approve
        # TODO: add check user credential and rights
        return 0
    def insertAudit(self, tbName, key, action):
        # action: 
        #         2=update
        #         4=delete
        #         8=approve
        ret = None
        try:
            data = {}
            data["dt"] = self.getByKey(tbName, key)
            data["_a"] = action
            data["_t"] = tbName
            data["_k"] = key
            data["_d"] = datetime.now(timezone.utc)
            result = r.table("_a").insert(data).run(self.getConn(), time_format="raw")
            if result["inserted"] > 0:
                ret = result["generated_keys"][0]
            return ret
        except Exception as e:
            logger.error({"mod":"Conn.insertAudit", "tbName":tbName, "key":key, "action":action, "data":data, "error":e})
            return None
    def insert(self, UserId, tbName, data):
        ret = None
        try:
            dateTimeNow = datetime.now(timezone.utc)
            if type(data) is list:
                dataLen = len(data)
                for i in range(dataLen):
                    if UserId:
                        data[i]["_u"] = UserId
                    data[i]["_d"] = dateTimeNow
            else:
                if UserId:
                    data["_u"] = UserId
                data["_d"] = dateTimeNow
            result = r.table(tbName).insert(data).run(self.getConn(), time_format="raw")
            # if result["inserted"] > 0 and "generated_keys" in result:
            #     ret = result["generated_keys"]
            # else:
            #     ret = ""
            return result
        except Exception as e:
            logger.error({"mod":"Conn.insert", "UserId":UserId, "tbName":tbName, "data":data, "error":e})
            return None
    def updateByKey(self, UserId, tbName, key, data):
        ret = None
        try:
            # save old data
            refKey = self.insertAudit(tbName, key, 2)
            if UserId:
                data["_u"] = UserId
            data["_d"] = datetime.now(timezone.utc)
            data["_r"] = refKey
            result = r.table(tbName).get(key).update(data).run(self.getConn(), time_format="raw")
            ret = result["replaced"]
            return ret
        except Exception as e:
            logger.error({"mod":"Conn.updateByKey", "tbName": tbName, "key": key, "data": data, "error": e})
            return None
    def updateByFilter(self, tbName, filter, data):
        pass
    def delete(self, tbName, key):
        ret = None
        try:
            # save old data
            refKey = self.insertAudit(tbName, key, 4)
            result = r.table(tbName).get(key).delete.run(self.getConn())
            ret = result["deleted"]
            return ret
        except Exception as e:
            logger.error({"mod":"Conn.delete", "tbName":tbName, "key":key, "error":e})
            return None
    def getByKey(self, tbName, key):
        try:
            return r.table(tbName).get(key).run(self.getConn())
        except Exception as e:
            logger.error({"mod":"Conn.getByKey", "tbName": tbName, "key": key, "error": e})
            return None

    # orderBy can be: "fieldName", ["fieldName1", "fieldName2"], lambda or {"keys": "fieldName" or ["fieldName1", "fieldName2"] or lambda, "index": "indexName"}
    def _orderBy(self, qry, orderBy):
        try:
            if type(orderBy) is list:
                qry = qry.order_by(*orderBy)
            elif type(orderBy) is dict:
                if type(orderBy["keys"]) is list:
                    qry = qry.order_by(*orderBy["keys"], index=orderBy["index"])
                else: # string or lambda
                    qry = qry.order_by(orderBy["keys"], index=orderBy["index"])
            else: # string or lambda
                qry = qry.order_by(orderBy)
        except Exception as e:
            logger.error({"mod":"Conn._orderBy", "qry": qry, "orderBy": orderBy, "error": e})
        return qry

    # e.g.:
    # ret = conn.getMany("TableName", getAll={"keys":*["Key1", "Key2"],"index":"indexName"})
    # ret = conn.getMany("TableName", *["Key1", "Key2"], "IndexName")
    # orderBy can be: "fieldName", ["fieldName1", "fieldName2"], {"keys": "fieldName" or ["fieldName1", "fieldName2"], "index": "indexName", "lambda": function}
    def getMany(self, tbName, getAll, orderBy):
        try:
            qry = r.table(tbName)
            if getAll != None:
                if getAll.index == None:
                    qry = qry.getAll(getAll.keys)
                else:
                    qry = qry.getAll(getAll.keys, index=getAll.index)
            if orderBy != None:
                qry = self._orderBy(qry, orderBy)

            return list(qry.run(self.getConn()))
        except Exception as e:
            logger.error({"mod":"Conn.getMany", "tbName":tbName, "getAll":getAll, "orderBy":orderBy, "error":e})
            return None

    def getPaging(self, tbName, limit, offset, indexName, indexAsc=True):
        try:
            if indexAsc:
                qry = r.table(tbName).order_by(index=indexName)
            else:
                qry = r.table(tbName).order_by(index=r.desc(indexName))
            if offset==0:
                #logger.debug(pName)
                qry = qry.limit(limit)
            else:
                qry = qry.slice(offset, offset+limit)
            return list(qry.run(self.getConn(), time_format="raw"))
        except Exception as e:
            logger.error({"mod":"Conn.getPaging", "tbName":tbName, "limit":limit, "offset":offset, "indexName":indexName, "indexAsc":indexAsc, "error":e})
            return None

    def getEnum(self, enumId=None, langCode=None, filter=None, orderBy=None):
        try:
            qry = r.table("_e")
            if orderBy != None:
                qry = self._orderBy(qry, orderBy)
            if filter != None:
                qry = qry.filter(filter)
            if enumId is None:
                qry = qry.pluck(["id","d","f","a"])
            else:
                qry = qry.get(enumId)
                if langCode != None:
                    # list only the requested langCode
                    lDef = qry.get_field("a").run(self.getConn())
                    qry = qry.pluck("a","d", {"e":["c",{"l":[langCode, lDef]}]})
            res = qry.run(self.getConn())
            return res
        except Exception as e:
            logger.error({"mod":"Conn.getEnum", "enumId":enumId, "langCode":langCode, "error":e})
            return None
