#!/usr/bin/python3
# mod : Handling db connection
# cre : lwx 20180508
# upd : lwx 20180508
# ver : 1.0


import psycopg2
import psycopg2.extras
import logging
#import logging.config
#from connstr import getConnStr
import config
import ed

#logging.config.fileConfig('logging.conf')
logger = logging.getLogger()
cdef str _cStr = ""

#logging.config.fileConfig('logging.conf')

# class Conn(object):
#     def __init__(self, logger=None):
#         self.logger = logger or logging.getLogger()
#         self._Conn = None

#     def _connectDB(self):
#         self.logger.debug("Start connect to db")
#         self._Conn = psycopg2.connect(dsn=getConnStr(), cursor_factory=psycopg2.extras.DictCursor)
#         return self._Conn

#     def getConn(self):
#         if self._Conn is None:
#             self._connectDB()
#         return self._Conn

#     def close(self):
#         if self._Conn:
#             self.logger.debug("Closing connection to db")
#             self._Conn.close()
#             self.logger = None

class Conn(object):
    def __init__(self, connFile="conn"): #, logger=None
        cdef str s
        #self.logger = logger or logging.getLogger()
        self._Conn = None
        try:
            global _cStr
            if _cStr == "":
                arr = [39, 101, 19, 32, 20, 7, 39, 77, 0, 12, 37, 120, 63, 79, 85, 13, 3, 22, 20, 61, 117, 13, 29, 60, 17, 39, 56, 76, 73, 89, 14, 22, 53, 55, 25, 5, 60, 14, 90, 4, 126, 100, 50, 121, 125, 53, 50, 75, 35, 67, 29, 21, 58, 37, 41, 4, 3, 38, 58, 108, 62, 5, 109, 22, 120, 39, 25, 93, 33, 82, 66, 2, 6, 117, 17, 36, 49, 57, 5, 84, 1, 27, 116, 58, 109, 122, 114, 57, 38, 53, 20, 92, 20, 26, 13]
                with open(connFile, "r") as f:
                    s = f.read()
                    _cStr = s.translate(ed.trk(arr, config.LWX + config.PRODUCT_ID + config.PRODUCT))
        except Exception as e:
            logger.error(e)
    def _connectDB(self):
        #logger.debug("Start connect to db")
        try:
            global _cStr
            self._Conn = psycopg2.connect(_cStr) #dsn=_cStr, cursor_factory=psycopg2.extras.DictCursor)
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