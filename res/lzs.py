#! /usr/bin/python3
# mod : Compress file to base64 lzstring
# cre : lwx 20190127
# upd : lwx 20190829
# ver : 1.2
#
# To compile: python -OO -m py_compile lzs.py

import io
import os
import sys
#from lzstring import LZString
#import codecs
#import curses
import ed

# def lzsBin(fileName):
#     with open(fileName, 'r') as f:
#         content = f.read()
#     lz = ed.LZString(ed.genKey())
#     #result = lz.compressToBase64(content)
#     result = lz.compress(content)
#     with open(fileName+'.bin', 'bw') as f:
#         #f.write(result)
#         #print(len(result))
#         #r=codecs.encode(result,"unicode_internal")
#         #print(len(r))
#         #f.write(r)
#         b = bytearray()
#         for c in result:
#             #f.write(bytes(ord(c)))
#             o = ord(c)
#             b1 = o >> 8
#             b2 = o & 0xff
#             #print(o,b1,b2)
#             b.extend([b1,b2])
#             #print(b[2])
#             #print(type(c), type(ord(c)), ord(c))
#         f.write(b)
#         print(b)
#     # # test decompression result
#     # with open(fileName+'.bin', 'br') as f:
#     #     with open(fileName+'.binori', 'w') as f1:
#     #         #dec = lz.fromBase64(result)
#     #         dat=f.read()
#     #         s=""
#     #         for c in range(0,len(dat),2):
#     #             b1=dat[c]
#     #             b2=dat[c+1]
#     #             s+=chr((b1<<8)+b2)
#     #         dec = lz.decompress(s)
#     #         f1.write(dec)

# def lzs128(fileName):
#     with open(fileName, 'r') as f:
#         content = f.read()
#     lz = ed.LZString(ed.genKey())
#     result = lz.toBase128(content)
#     with open(fileName+'.128', 'w') as f:
#         f.write(result)
#     # # test decompression result
#     # with open(fileName+'.128', 'r') as f:
#     #     with open(fileName+'.ori', 'w') as f1:
#     #         dec = lz.decompressFromBase128(f.read())
#     #         f1.write(dec)

def lzs(iType, iFile, oFile):
    with open(iFile, 'r') as f:
        content = f.read()
    if iType == 1:
        key = ed.genKey(0,[57,47,-1,90,64,-1,97,123,1,95,96,1,45,47,1])
    else:
        key = ed.genKey()
    lz = ed.LZString(key)
    result = lz.toBase64(content)
    with open(oFile, 'w') as f:
        f.write(result)
    ## test decompression result
    # with open(fileName+'.txt', 'r') as f:
    #     with open(fileName+'.ori', 'w') as f1:
    #         dec = lz.decompressFromBase64(f.read())
    #         f1.write(dec)

def _getOutFile(iFile):
    folder, iFileName = os.path.split(iFile)
    #print("1",folder, iFileName)
    idx = iFileName.find(".", 1)
    #print("2",idx)
    outFileName = ""
    if idx > 0:
        outFileName = iFileName[:idx]
        #print("3",outFileName)
    else:
        outFileName = iFileName
        #print("4",outFileName)
    outFileName += ".txt"
    return os.path.join(folder, outFileName)

def _getFile():
    iFile = input("What file to encrypt: ")
    #print("0",iFile)
    oFile = _getOutFile(iFile)
    #print("5",outFile)
    return (iFile, oFile)

def _printHelp():
    s = sys.argv[0]
    print("Ussage: python %s [SWITCH]" % (s))
    print("[SWITCH]:")
    print(" -t=TYPE 1 or 2, default 2")
    print(" -f=Input FILE_PATH")
    print(" -o=Output FILE_PATH")
    print("Example:")
    print(" python %s -t=1" % (s))
    print(" python %s -t=2 -f=/path/to/file.min.js" % (s))

def _run(iType, iFile):
    if iFile == "":
        newFile = True
    else:
        oFile = _getOutFile(iFile)
        newFile = False
    if iType == None:
        iType = -1
    while True:
        try:
            if newFile:
                iFile, oFile = _getFile()
            #print(iFile, oFile)
            print("Output file: {}".format(oFile))
            lzs(iType, iFile, oFile)
            command = input("What do You want to do (r=Repeat, n=New file, else to exit)? ")
            command = command.lower()
            if command == "r":
                newFile = False
            elif command == "n":
                newFile = True
            else:
                break
        except Exception as e:
            print(e)
            break    

if __name__ == '__main__':
    argLen = len(sys.argv)
    if argLen > 1:
        try:
            argErr = False
            iType = 2
            iFile = ""
            oFile = ""
            for i in range(1, argLen):
                s = sys.argv[i]
                switch = s[:3]
                val = s[3:]
                if switch == "-t=":
                    iType = int(val)
                elif switch == "-f=":
                    iFile = val
                elif switch == "-o=":
                    oFile = val
                else:
                    argErr = True
                    break
            if argErr:
                _printHelp()
            else:
                #print(iType, iFile)
                #_run(iType, iFile)
                lzs(iType, iFile, oFile)
        except Exception as e:
            _printHelp()
            print(e)
        #lzsBin(sys.argv[1])
        #lzs128(sys.argv[1])
    else:
        _run(None, "")