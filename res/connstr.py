#! /usr/bin/python3
# mod : creating db connection
# cre : lwx 20180208
# upd : lwx 20191121
# ver : 2.0

import string
import io
import random

# LWX = "Li Weixia"
# PRODUCT_ID = "hris"
# PRODUCT = "lisoft hris"
from config import LWX, PRODUCT_ID, PRODUCT

dicE = {32: 117, 33: 48, 34: 90, 35: 119, 36: 71, 37: 124, 38: 33, 39: 57, 40: 91, 41: 39, 42: 88, 43: 76, 44: 47, 45: 52, 46: 73, 47: 61, 48: 58, 49: 53, 50: 40, 51: 116, 52: 83, 53: 95, 54: 125, 55: 101, 56: 109, 57: 113, 58: 126, 59: 103, 60: 43, 61: 79, 62: 32, 63: 68, 64: 41, 65: 65, 66: 49, 67: 104, 68: 105, 69: 87, 70: 97, 71: 120, 72: 118, 73: 122, 74: 112, 75: 51, 76: 37, 77: 36, 78: 69, 79: 92, 80: 98, 81: 89, 82: 75, 83: 115, 84: 66, 85: 77, 86: 107, 87: 38, 88: 67, 89: 34, 90: 93, 91: 70, 92: 84, 93: 44, 94: 63, 95: 80, 96: 123, 97: 54, 98: 114, 99: 96, 100: 108, 101: 106, 102: 60, 103: 100, 104: 121, 105: 81, 106: 74, 107: 102, 108: 94, 109: 78, 110: 56, 111: 45, 112: 59, 113: 85, 114: 46, 115: 50, 116: 55, 117: 82, 118: 42, 119: 99, 120: 111, 121: 62, 122: 64, 123: 110, 124: 72, 125: 35, 126: 86}
#dicD = {35: 32, 94: 33, 112: 34, 116: 35, 66: 36, 41: 37, 49: 38, 95: 39, 114: 40, 103: 41, 125: 42, 38: 43, 48: 44, 44: 45, 36: 46, 77: 47, 61: 48, 81: 49, 106: 50, 37: 51, 75: 52, 88: 53, 78: 54, 33: 55, 40: 56, 120: 57, 71: 58, 105: 59, 59: 60, 124: 61, 115: 62, 101: 63, 60: 64, 42: 65, 100: 66, 119: 67, 110: 68, 46: 69, 122: 70, 45: 71, 89: 72, 56: 73, 104: 74, 107: 75, 102: 76, 86: 77, 39: 78, 117: 79, 91: 80, 87: 81, 98: 82, 84: 83, 126: 84, 63: 85, 58: 86, 113: 87, 70: 88, 68: 89, 65: 90, 32: 91, 76: 92, 111: 93, 64: 94, 109: 95, 123: 96, 82: 97, 99: 98, 53: 99, 69: 100, 34: 101, 72: 102, 55: 103, 54: 104, 90: 105, 57: 106, 96: 107, 92: 108, 118: 109, 85: 110, 80: 111, 51: 112, 79: 113, 62: 114, 67: 115, 121: 116, 93: 117, 83: 118, 52: 119, 47: 120, 73: 121, 97: 122, 43: 123, 50: 124, 74: 125, 108: 126}
#dicA = [35, 94, 112, 116, 66, 41, 49, 95, 114, 103, 125, 38, 48, 44, 36, 77, 61, 81, 106, 37, 75, 88, 78, 33, 40, 120, 71, 105, 59, 124, 115, 101, 60, 42, 100, 119, 110, 46, 122, 45, 89, 56, 104, 107, 102, 86, 39, 117, 91, 87, 98, 84, 126, 63, 58, 113, 70, 68, 65, 32, 76, 111, 64, 109, 123, 82, 99, 53, 69, 34, 72, 55, 54, 90, 57, 96, 92, 118, 85, 80, 51, 79, 62, 67, 121, 93, 83, 52, 47, 73, 97, 43, 50, 74, 108]
dicAE = [57, 89, 122, 32, 34, 21, 89, 80, 58, 64, 47, 46, 104, 122, 60, 78, 91, 21, 79, 3, 49, 19, 20, 69, 58, 20, 23, 31, 66, 46, 71, 51, 75, 6, 127, 29, 26, 54, 65, 31, 1, 24, 60, 90, 5, 115, 32, 53, 26, 48, 42, 20, 53, 47, 44, 104, 54, 81, 60, 102, 51, 91, 93, 28, 18, 22, 37, 5, 5, 18, 85, 5, 30, 38, 40, 33, 16, 59, 75, 76, 27, 50, 89, 80, 123, 59, 10, 52, 10, 87, 56, 7, 41, 68, 33]

def _encKey(arr):
    s = LWX + PRODUCT_ID + PRODUCT
    lenS = len(s)
    k = []
    l = len(arr)
    for i in range(l):
        #print("i: {}, char: {}, ord: {}, aChar: {}, result: {}".format(i,s[i % lenS],ord(s[i % lenS]), arr[i], ord(s[i % lenS]) ^ arr[i]))
        k.append(ord(s[i % lenS]) ^ arr[i])
    return k

def _getDicE(arr):
    t = {}
    l = len(arr)
    for i in range(l):
        t[i+32]=arr[i]
    return t

def _getDicD(arr):
    s = LWX + PRODUCT_ID + PRODUCT
    lenS = len(s)
    k = 0
    key = {}
    l = len(arr)
    for i in range(l):
        k = ord(s[i % lenS]) ^ arr[i]
        key[k]=i+32
    return key

def _enc(s, key):
    return s.translate(key)

def _dec(s, arrKey):
    key = _getDicD(arrKey)
    return s.translate(key)

def _saveConnStr(connStr):
    with open("conn", "w") as f:
        f.write(connStr)

def _loadConnStr(connFile):
    encConnStr = ""
    try:
        with open(connFile, "r") as f:
            encConnStr = f.read()
    except Exception as e:
        print("unable to open " + connFile + "file")
    return encConnStr

def _genNewKey():
    m1 = ""
    for i in range(32,127):
        m1 += chr(i)
    #print(m1)

    t = m1
    m2 = ""
    l = len(m1)
    for i in range(l):
        c = random.choice(t)
        m2 += c
        t = t.replace(c,"")
    print("new key: " + m2)
    d1 = {}
    d2 = {}
    o1 = 0
    o2 = 0
    a = []
    for i in range(l):
        o1 = ord(m1[i])
        o2 = ord(m2[i])
        a.append(o2)
        d1[o1] = o2
        d2[o2] = o1
    a = _encKey(a)
    print("New encrypt dict: ", d1)
    #print(d2)
    print("New decrypt arr:  ", a)
    return (d1, a)

if __name__ == '__main__':
    from datetime import datetime

    d = _loadConnStr("conn")
    if d != "":
        print("Current connection string is: " + _dec(d, dicAE))
    isNewKey = s = input("Generate new encryption key? (Y/N): ")
    if isNewKey == "Y":
        (dicE, dicAE) = _genNewKey()
    s = input("Type the connection string: ")
    print(datetime.now())
    e = _enc(s, dicE)
    _saveConnStr(e)
    d = _dec(_loadConnStr("conn"), dicAE)
    print(e)
    print(d)
    print(datetime.now())

    #ERlj];y#o]]i#n*i;9y#8!]#nK:i$y#6qY1Y61DM16D#n!jiir:9Ey#6YpVj}#