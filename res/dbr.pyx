#!/usr/bin/python3
# mod : Handling rethinkdb connection
# cre : lwx 20200106
# upd : lwx 20200106
# ver : 1.0

import logging
import config
import ed
import json
import datetime

from rethinkdb import r
from lib import Parseval


logger = logging.getLogger()
_connDt = None # = {
#                    "host": "",
#                    "port": "",
#                    "db": "",
#                    "user": "",
#                    "password": ""
#                }

# system table:
#     "_a" : audit trail
#     "_b" : browsing statistic log

# system field Name:
#     "_a" = action
#     "_t" = tbName
#     "_k" = key
#     "_u" = UserId
#     "_d" = datetime.utcnow()
#     "_r" = refKey
#     "_l" = logs

class Conn(object):
    def __init__(self, connFile="conn"): #, logger=None
        self._Conn = None
        try:
            global _connDt
            if _connDt == None:
                arr = ##keyDec##
                with open(connFile, "r") as f:
                    s = f.read()
                    cStr = s.translate(ed.trk(arr, config.LWX + config.PRODUCT_ID + config.PRODUCT))
                    _connDt = json.loads(cStr)
        except Exception as e:
            logger.error(e)
    def _connectDB(self):
        #logger.debug("Start connect to db")
        try:
            global _connDt
            self._Conn = r.connect(host=_connDt['host'], port=_connDt['port'], db=_connDt['db'], user=_connDt['user'],password=_connDt['password']).repl()
            return self._Conn
        except Exception as e:
            logger.error(e)
            return None
    def getConn(self):
        if self._Conn is None:
            self._connectDB()
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
    def insertAudit(self, tbName, key, action, UserId):
        # action: 
        #         2=update
        #         4=delete
        #         8=approve
        ret = None
        try:
            data = {}
            log = []
                if isinstance(key, str) == True:
                    if key == 'All':
                        log = self.getAll(tbName)
                    else:
                        log = self.getByKey(tbName, key)
                elif isinstance(key,dict) == True:
                    log = self.getByFilter(tbName, key)
                else:
                    if len(key) > 1:
                        log = self.getByKeys(tbName, key)
                    else:
                        log = self.getByKey(tbName, key[0])
            data["_a"] = action
            data["_t"] = tbName
            data["_u"] = UserId
            data["_d"] = datetime.datetime.now(datetime.timezone.utc)
            data["_k"] = key
            data["_l"] = log
            result = r.table("_audittrail").insert(data).run(self.getConn(), time_format="raw")
            if result["inserted"] > 0:
                ret = result["generated_keys"][0]
            return ret
        except Exception as e:
            logger.error({"action": "insertAudit", "tbName": tbName, "data": data, "error": e})
            return None
    def insert(self, tbName, data, UserId):
        ret = None
        try:
            data.extend([{
                "n": "_cb",
                "v": UserId,
                "t": "0"
            },{
                "n": "_cd",
                "v": datetime.datetime.now(datetime.timezone.utc),
                "t": "0"
            }])
            result = r.table(tbName).insert(Parseval.objData(data)).run(self.getConn(), time_format="raw")
            if result["inserted"] > 0:
                ret = result["generated_keys"]
            return ret
        except Exception as e:
            logger.error({"action": "insert", "tbName": tbName, "data": data, "error": e})
            return None
    def insert_many(self,tbName,_insert_,UserId):
        try:
            if UserId is not None:
                for i, data in enumerate(_insert_):
                    data['_cd'] = datetime.datetime.now(datetime.timezone.utc)
                    data['_cb'] = UserId
            result = r.table(tbName).insert(_insert_).run(self.getConn(), time_format="raw")
            if result["inserted"] > 0:
                ret = result["generated_keys"]
        except Exception as e:
            logger.error({"action": "insert_many", "tbName": tbName, "data": _insert_, "error": e})
            return None
    def updateByKey(self, tbName, key, data, UserId):
        ret = None
        try:
            # save old data
            refKey = self.insertAudit(tbName, key, 2, UserId)
            data.extend([{
                "n": "_ub",
                "v": UserId,
                "t": "0"
            },{
                "n": "_ud",
                "v": datetime.datetime.now(datetime.timezone.utc),
                "t": "0"
            },{
                "n": "_rk",
                "v": refKey,
                "t": "0"
            }])
            result = r.table(tbName).get(key).update(Parseval.objData(data)).run(self.getConn(), time_format="raw")
            ret = result["replaced"]
            return ret
        except Exception as e:
            logger.error({"action": "updateByKey", "tbName": tbName, "key": key, "data": data, "error": e})
            return None
    def updateByFilter(self, tbName, filter, data):
        pass
    def delete(self, tbName, key, UserId):
        ret = None
        result = None
        try:
            # save old data
            refKey = self.insertAudit(tbName, key, 4, UserId)
            if len(key) > 1:
                result = r.table(tbName).get_all(r.args(key)).delete().run(self.getConn(), time_format="raw")
            elif isinstance(key,dict) == True:
                result = r.table(tbName).filter(key).delete().run(self.getConn(), time_format="raw")
            else:
                result = r.table(tbName).get(key[0]).delete().run(self.getConn(), time_format="raw")
            ret = result["deleted"]
            return ret
        except Exception as e:
            logger.error({"action": "delete", "tbName": tbName, "key": key, "error": e})
            return None
    def getAll(self, tbName):
        try:
            return r.table(tbName).run(self.getConn(), time_format="raw")
        except Exception as e:
            logger.error({"action": "getAll", "tbName": tbName, "error": e})
            return None
    def getByKey(self, tbName, key):
        try:
            return r.table(tbName).get(key).run(self.getConn(), time_format="raw")
        except Exception as e:
            logger.error({"action": "getByKey", "tbName": tbName, "key": key, "error": e})
            return None
    def getByKeys(self, tbName, keys):
        try:
            return r.table(tbName).get_all(r.args(keys)).run(self.getConn(), time_format="raw")
        except Exception as e:
            logger.error({"action": "getByKeys", "tbName": tbName, "key": keys, "error": e})
            return None
    def getPaging(self, tbName, limit, idx, indexName, indexAsc=True):
        try:
            if indexAsc:
                qry = r.table(tbName).order_by(index=indexName)
            else:
                qry = r.table(tbName).order_by(index=r.desc(indexName))
            if idx==0:
                #logger.debug(pName)
                qry = qry.limit(limit)
            else:
                qry = qry.slice(idx, idx+limit)
            return qry.coerce_to('array').run(self.getConn(), time_format="raw")
        except Exception as e:
            logger.error({"action": "getPaging", "tbName": tbName, "filter": filter, "limit": limit, "idx": idx, "error": e})
            return None
    def getLookUpTable(self, tbName, tJoins, fParam, fOrder):
        try:
            logger.info(1)
            qry = r.table(tbName)
            if fParam is not None:
                logger.info(2)
                qry = qry.filter(fParam)
            if fOrder is not None:
                if fOrder['_t'] == 1:
                    logger.info(3)
                    qry = qry.order_by(fParam)
                else:
                    logger.info(4)
                    qry = qry.order_by(r.desc(fOrder['_f']))
            logger.info(5)
            res = qry.coerce_to('array').run(self.getConn(),time_format="raw")
            resLen = len(res)
            if tJoins is not None:
                for j in range(resLen):
                    for i in tJoins:
                        logger.info("6:"+json.dumps(i))
                        res2 = r.table(i['_t']).get_all(lookUpData[i['_f']],index='id').coerce_to('array').run(self.getConn(),time_format="raw")
                        res[j][i['_f']] = res2
            logger.info(7)
            return res
        except Exception as e:
            logger.error({"action": "getLookUpTable", "tbName": tbName, "tJoins":tJoins, "fParam":fParam, "fOrder":fOrder, "error": e})
            return None
    def getJoinTable(self, tbName, tJoins, fParam, fOrder):
        try:
            qry = r.table(tbName)
            if fParam is not None:
                qry = qry.filter(fParam)
            if fOrder is not None:
                if fOrder['_t'] == 1:
                    qry = qry.order_by(fParam)
                else:
                    qry = qry.order_by(r.desc(fOrder['_f']))
            if tJoins is not None:
                for i in tJoins:
                    qry = qry.eq_join(i['_f'],r.table(i['_t'])).without({'right': ['id']}).zip()
            return qry.coerce_to('array').run(self.getConn(),time_format="raw")
        except Exception as e:
            logger.error({"action": "getJoinTable", "tbName": tbName, "error": e})
            return None
    def getByFilter(self, tbName, param):
        try:
            return r.table(tbName).filter(param).coerce_to('array').run(self.getConn(), time_format="raw")
        except Exception as e:
            logger.error({"action": "getByFilter", "tbName": tbName, "param": param, "error": e})
            return None
    def createTable(self, tbName):
        try:
            return r.table_create(tbName).run(self.getConn(), time_format="raw")
        except Exception as e:
            logger.error({"action": "createTable", "tbName": tbName, "error": e})
            return None
    def sideMenu(self,param):
        try:
            return r.table("menuspermissions").filter(param).eq_join("menu_id", r.table("menus")).zip().order_by("sortnumber").run(self.getConn(), time_format="raw")
        except Exception as e:
            logger.error({"action": "sideMenu", "param": param, "error": e})
            return None
    def userGroup(self,param):
        try:
            return r.table("usergroups").get_all(*param,index= "usergroup").order_by("id").coerce_to('array').run(self.getConn(), time_format="raw")
        except Exception as e:
            logger.error({"action": "userGroup", "param": param, "error": e})
            return None
    def getActPermission(self,group_id):
        try:
            return r.table("menuspermissionact").filter({'guid':group_id}).merge(lambda lookUpData: { 'controllerData': r.table('modulesapp').get_all(lookUpData['controller_name'],index='id').coerce_to('array') }).run(self.getConn(), time_format="raw")
        except Exception as e:
            logger.error({"action": "getActPermission", "param": param, "error": e})
            return None
    def getAudittrail(self,tbuser):
        try:
            return r.table("_audittrail").order_by(r.desc("_d")).merge(lambda lookUpData: { 'user_data': r.table(tbuser).get_all(lookUpData['_u'],index='id').coerce_to('array') }).coerce_to('array').run(self.getConn(),time_format="raw")
        except Exception as e:
            logger.error({"action": "getAudittrail", "error": e})
            return None
    def getMenus(self):
        try:
            results = r.table("menus").order_by("sortnumber").run(self.getConn(),time_format="raw")
            return results
        except Exception as e:
            logger.error({"action": "getMenus", "error": e})
            return None