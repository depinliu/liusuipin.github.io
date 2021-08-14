#!/usr/bin/python3

from dbr import Conn
from rethinkdb import r
import json

def testPaging(tbName, limit, offset, index):
    conn = Conn()
    ret = conn.getPaging(tbName, limit, offset, index)
    conn.close()
    return ret

def insert(userId, tbName, data):
    conn = Conn()
    ret = conn.insert(userId, tbName, data)
    conn.close()
    return ret

def getEnum(enumId, langCode=None):
    conn = Conn()
    ret = conn.getEnum(enumId, langCode)
    conn.close()
    return ret

def filterMatch():
    def _myFilter(myField, sRegEx):
        def _myProcess(row):
            res = True
            for x in range(lenParam):
                res &= row[myField].match(sRegEx)
            return res
        return _myProcess
    conn = Conn()
    myFilter = _myFilter("name", "Wor")
    qry = r.table("p0")
    qry = qry.filter(myFilter)
    res = qry.run(conn.getConn())
    print(res)
    conn.close()

if __name__ == '__main__':
    # res = testPaging("p0", 2, 0, "name")
    # print(res)

    #region insert data
    data = [
                {
                    "id": "ADMIN@lisoft.ID",
                    "r": ["0"],
                    "o": ["0"]
                },
                {
                    "id": "LISUYANTO@YAHOO.COM",
                    "p": "0",
                    "r": ["0", "1", "f0480933-fe12-4931-affc-a900f6bf10c2", "6da69895-021b-4f3b-9180-a39e0796f9a5"],
                    "o": ["0", "59128ab1-85b0-4754-9185-0dd41faff023"]
                }
            ]
    print(type(data))
    res = insert("ADMIN@lisoft.ID", "_g", data)
    print(type(res))
    print(json.dumps(res, default=str))
    #endregion insert data

    # #region test enum
    # print(getEnum("BAHASA", "id"))
    # print(getEnum("ORGANISASI", "en"))
    # print(json.dumps(getEnum("JENDER"), default=str))
    # #endregion test enum

    #region test filter match
    #filterMatch()
    #endregion test filter match
