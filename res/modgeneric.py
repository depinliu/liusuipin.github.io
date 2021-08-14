#!/usr/bin/python3
# mod : Generic API
# cre : lwx 20180520
# upd : lwx 20180520
# ver : 0.1

# http://initd.org/psycopg/docs/usage.html
# https://wiki.postgresql.org/wiki/Psycopg2_Tutorial

import bottle
from bottle import Bottle, route, run, get, post, put, delete, error, request, response
import json
import logging
import string
from lib import CONTENT_TYPE_JSON, enable_cors, logErrReturnJSON, arr2KeyVal
import psycopg2
import psycopg2.extras
from db import Conn

# Define bottle app
modGeneric = Bottle()

_TABLE = 'location'
logger = logging.getLogger()


@modGeneric.route('/jsn/g/<id>', method='OPTIONS')
@enable_cors
def _getJSON(id):
    return ''

@modGeneric.route('/jsn/g/<id>', method='GET')
@enable_cors
def getJSON(id):
    bottle.local.conn = Conn(logger).getConn()
    response.content_type = CONTENT_TYPE_JSON
    try:
        with bottle.local.conn as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT dt FROM json WHERE id=%s;", id)
                rows = cur.fetchall()
                #print(rows['description'][0])
                print(rows)
        conn.close()
    except psycopg2.Error as e:
        return logErrReturnJSON(logger, e.pgcode, e.pgerror)
    except Exception as e:
        return logErrReturnJSON(logger, '1', e)
    return json.dumps({'status': 0, 'data': rows[0][0]})


@modGeneric.route('/jsn/gc/<code>', method='OPTIONS')
@enable_cors
def _getCategoryByCode(code):
    return ''

@modGeneric.route('/jsn/gc/<code>', method='GET')
@enable_cors
def getCategoryByCode(code):
    bottle.local.conn = Conn(logger).getConn()
    response.content_type = CONTENT_TYPE_JSON
    try:
        with bottle.local.conn as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT dt FROM json WHERE alias='Status';")
                rows = cur.fetchall()
                #print(rows['description'][0])
                print(rows)
        conn.close()
    except psycopg2.Error as e:
        return logErrReturnJSON(logger, e.pgcode, e.pgerror)
    except Exception as e:
        return logErrReturnJSON(logger, '1', e)
    return json.dumps({'status': 0, 'data': rows[0][0]})


@modGeneric.route('/enm/l/<id>', method='OPTIONS')
@enable_cors
def _listEnum(id):
    return ''

@modGeneric.route('/enm/l/<id>', method='GET')
@enable_cors
def listEnum(id):
    bottle.local.conn = Conn(logger).getConn()
    response.content_type = CONTENT_TYPE_JSON
    try:
        with bottle.local.conn as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, value FROM enumd WHERE ide=%s ORDER BY id ASC;", id)
                rows = cur.fetchall()
                #print(rows['description'][0])
                print(rows)
        conn.close()
    except psycopg2.Error as e:
        return logErrReturnJSON(logger, e.pgcode, e.pgerror)
    except Exception as e:
        return logErrReturnJSON(logger, '1', e)
    return json.dumps({'status': 0, 'data': arr2KeyVal(rows)})