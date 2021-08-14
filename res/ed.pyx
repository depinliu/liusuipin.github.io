#!/usr/bin/python3
# mod : encryption decryption module
# cre : lwx 20180428
# upd : lwx 20201211
# ver : 1.1

from random import randint,choice
import string
import math #needed by: lzstring
import re   #needed by: lzstring

# http://docs.cython.org/en/latest/src/tutorial/cython_tutorial.html

#region encryption
#Base N Encryption
# base 6 bit = base 64 bit encrypt
def genKey(int t=-1, a=None):
    # t=type
    cdef int i, j, x, y, l, p, q
    cdef str k, s, c #c=keyChoice
    k = "" #k=key
    s = "" #suffix
    if a == None:
        p = 2 #step on array
        q = 1 #step for producing key
        a = [65,91,97,123,48,58] #array range
        if t == 0: #standard base 64
            s = "+/="
        elif t == 1: #non standard uri safe base 64
            s = "-_." #standard uri safe using "+-$"
        elif t == 2: #non standard base 64
            a = [97,123,63,91,48,59]
        elif t == 3: #0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
            a = [48,58,65,91,97,123]
        elif t == 5: #()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~!#$%&
            s = "!#$%&"
            a = [40,92,93,127]
        elif t == 6: #0123456789abcdefghijklmnopqrstuvwxyz-_.
            s = "-_."
            a = [48,58,97,123]
        elif t == 7: #23456789ABCDEFGHJKLMNPQRSTUVWXYZ
            a = [50,58,65,73,74,79,80,91]
        elif t == 8: #0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ, can be use to encode table name to number
            a = [48,58,65,91]
        elif t == 9: #Random 64 key
            c = genKey(10)
            #s = "" #s here actually temp
            for i in range(64):
                s = choice(c)
                c = c.replace(s, "")
                k += s
            return k
        elif t == 10: #string for use in t=9
            a = [32,127]
        else: #own base 2 to base 128
            k = "!"
            a = [35,39,40,47,48,92,93,96,97,127,192,231]
    else:
        p = 3 #step on array
    l = len(a)
    for i in range(0, l, p):
        x = a[i]
        y = a[i+1]
        if p == 3:
            q = a[i+2]
        for j in range(x, y, q):
            k += chr(j)
    return k + s

class BNE:
    #bL = baseN_Bit_Length, 
    def __init__(self, int bL=7, str k=""):
        if k == "":
            self._k = genKey() #default key
        else:
            self._k = k
        self._bL = bL
    def Enc(self, str s):
        #s=source
        cdef int d, l, m, b, j, i
        cdef str r
        d = 0 #d=binData
        l = 0 #l=data bit length
        m=8 #max bit length in an acii
        b = (2**self._bL) - 1 #baseNBit
        r = "" #enc result
        j = len(s) #source length
        i = 0
        while i < j:
            d = (d<<m) + ord(s[i])
            i += 1
            l += m
            while l >= self._bL:
                l -= self._bL
                r += self._k[(d >> l) & b]
                d &= (2**l)-1
        if l>0:
            r += self._k[(d << (self._bL - l)) & b]
        return r
    def Dec(self, str s):
        cdef int d, l, m, j, i
        cdef str r
        d = 0
        l = 0
        m = 8
        r = ""
        j = len(s)
        i = 0
        while i < j:
            d = ((d&255) << self._bL) + self._k.index(s[i])
            i += 1
            l += self._bL
            if l >= m:
                l -= m
                r += chr((d >> l) & 255)
        return r

class BN:
    def __init__(self, str k=""):
        if k == "":
            self._k = genKey(3)
        else:
            self._k = k
        self._b = len(self._k) #_b=baseN
    def toBaseN(self, n):
        #n=base10Number
        cdef m #m=remain
        cdef str r
        if n <= 0:
            return self._k[0]
        r = ""
        while n >= self._b:
            m = n % self._b
            n //= self._b
            r = self._k[m] + r
        if n > 0:
            r = self._k[n] + r
        return r
    def toBase10(self, str s):
        cdef int i, l, d #d=digit
        cdef n = 0
        l = len(s)
        for i in range(l):
            d = self._k.index(s[i])
            n += (self._b ** (l - i - 1)) * d
        return n

def captchaWord(bint isNum=True, bint isLower=False, bint isUpper=True, bint excludeConfusingChar=False, int minLength=6, int maxLength=8):
    cdef int n, m, x, i, l
    cdef str a="", exclude #a=all possible char
    # n = 6 # minimum number of char
    # m = 8 # maximum number of char
    if isNum:
        a += string.digits
    if isUpper:
        a += string.ascii_uppercase
    if isLower:
        a += string.ascii_lowercase
    if excludeConfusingChar:
        exclude = "iIl0oO"
        l = len(exclude)
        for i in range(l):
            a = a.replace(exclude[i],"")
    l = randint(minLength, maxLength)
    return "".join(choice(a) for x in range(l))

class RandomStr:
    def __init__(self, bint isNum=True, bint isLower=True, bint isUpper=True, bint isPunctuation=True, str including="", str exclude=""):
        cdef int l, i
        cdef str k=""
        if isNum:
            k += string.digits
        if isLower:
            k += string.ascii_lowercase
        if isUpper:
            k += string.ascii_uppercase
        if isPunctuation:
            k += string.punctuation
        if including!="":
            k += including
        if exclude!="":
            l = len(exclude)
            for i in range(l):
                k = k.replace(exclude[i],"")
        self._k = k
    def newStr(self, int minLength, int maxLength=0, unique=False):
        cdef str res="", temp="", tmpKey=self._k
        cdef int i
        if maxLength>0:
            minLength = randint(minLength, maxLength)
        if unique and minLength<=len(tmpKey):
            for i in range(minLength):
                temp = choice(tmpKey)
                res += temp
                tmpKey = tmpKey.replace(temp, "")
        else:
            res = res.join(choice(tmpKey) for i in range(minLength))
        return res

class RndSafeURL(RandomStr):
    def __init__(self, str including="-_~"):
        super().__init__(isPunctuation=False, including=including)
    def newURL(self, int minLength=10, int maxLength=30):
        return super().newStr(minLength, maxLength)

# default encrypt decrypt
def ed(str s, str p="", str q=""):
    # TODO: create 32 bit enc using big prime
    # https://en.wikipedia.org/wiki/List_of_prime_numbers
    # http://compoasso.free.fr/primelistweb/page/prime/liste_online_en.php
    # 67280421310721 : 1111010011000011110001100111001101000100000001 (bin 46 digit)
    # 99194853094755497 : 101100000011010010011000101111110010000101000110010101001 (bin 57 digit)
    # 2971215073 : 10110001000110010010010011100001 (bin 32 digit)
    #s=source
    cdef int z, m, a, l, i, j, x, h, t #t=tmp
    cdef str r
    z = 0 #z=zero
    m = 11 #multiplier
    a = 17 #adder
    l = len(s) #l=source length
    i = len(p)
    j = len(q) #length2=len(q) #use j to simplify code
    w = [i,m,a,j] #pwd array
    x = z
    if i > j:
        h = i
    else:
        h = j
    for x in range(0, h):
        if i > x:
            w.append(ord(p[x]))
        if j > x:
            w.append(ord(q[x]))
    #print(w)
    h = len(w)-1 #h=pwd length
    #print("x: ", x, "w: ", len(w), h)
    j = 255 #byteMaxValue
    i = z
    r = "" #r=result
    x+=1 #pwdIndex
    #print(x)
    for i in range(0, l):
        if x >= h:
            x = 0
        else:
            x += 1
        t = (m * w[x] + a) % j
        w[x] = t
        r += chr(ord(s[i]) ^ t)
    return r

def trk(a, str p):
    #translation key
    #a=arr for translation key
    #p=password
    cdef int h, k, i, l
    h = len(p)
    k = 0
    d = {}
    l = len(a)
    for i in range(l):
        k = ord(p[i % h]) ^ a[i]
        d[k] = i + 32
    return d

#endregion encryption

#region LZString
_rvDisc = {}; #baseReverseDic

class Object(object):
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

def _bVal(a, c): #getBaseValue(alphabet, character)
    if a not in _rvDisc:
        _rvDisc[a] = {}
    for i in range(len(a)):
        _rvDisc[a][a[i]] = i
    return _rvDisc[a][c]

def _lzc(src, int bitsPerChar, getCharFromInt): #compression
    cdef int ctxenlargeIn, ctxDicSz, ctxNBits, ctxDtVal, ctxDtPos, ii, i, val
    if (src is None):
        return ""

    ctxDic = {}
    ctxDicToCreate= {}
    ctxc = ""
    ctxwc = ""
    ctxw = ""
    ctxenlargeIn = 2 # Compensate for the first entry which should not count
    ctxDicSz = 3
    ctxNBits = 2
    ctxDt = []
    ctxDtVal = 0
    ctxDtPos = 0

    for ii in range(len(src)):
        ctxc = src[ii]
        if ctxc not in ctxDic:
            ctxDic[ctxc] = ctxDicSz
            ctxDicSz += 1
            ctxDicToCreate[ctxc] = True

        ctxwc = ctxw + ctxc
        if ctxwc in ctxDic:
            ctxw = ctxwc
        else:
            if ctxw in ctxDicToCreate:
                if ord(ctxw[0]) < 256:
                    for i in range(ctxNBits):
                        ctxDtVal = (ctxDtVal << 1)
                        if ctxDtPos == bitsPerChar-1:
                            ctxDtPos = 0
                            ctxDt.append(getCharFromInt(ctxDtVal))
                            ctxDtVal = 0
                        else:
                            ctxDtPos += 1
                    val = ord(ctxw[0])
                    for i in range(8):
                        ctxDtVal = (ctxDtVal << 1) | (val & 1)
                        if ctxDtPos == bitsPerChar - 1:
                            ctxDtPos = 0
                            ctxDt.append(getCharFromInt(ctxDtVal))
                            ctxDtVal = 0
                        else:
                            ctxDtPos += 1
                        val = val >> 1

                else:
                    val = 1
                    for i in range(ctxNBits):
                        ctxDtVal = (ctxDtVal << 1) | val
                        if ctxDtPos == bitsPerChar - 1:
                            ctxDtPos = 0
                            ctxDt.append(getCharFromInt(ctxDtVal))
                            ctxDtVal = 0
                        else:
                            ctxDtPos += 1
                        val = 0
                    val = ord(ctxw[0])
                    for i in range(16):
                        ctxDtVal = (ctxDtVal << 1) | (val & 1)
                        if ctxDtPos == bitsPerChar - 1:
                            ctxDtPos = 0
                            ctxDt.append(getCharFromInt(ctxDtVal))
                            ctxDtVal = 0
                        else:
                            ctxDtPos += 1
                        val = val >> 1
                ctxenlargeIn -= 1
                if ctxenlargeIn == 0:
                    ctxenlargeIn = math.pow(2, ctxNBits)
                    ctxNBits += 1
                del ctxDicToCreate[ctxw]
            else:
                val = ctxDic[ctxw]
                for i in range(ctxNBits):
                    ctxDtVal = (ctxDtVal << 1) | (val & 1)
                    if ctxDtPos == bitsPerChar - 1:
                        ctxDtPos = 0
                        ctxDt.append(getCharFromInt(ctxDtVal))
                        ctxDtVal = 0
                    else:
                        ctxDtPos += 1
                    val = val >> 1

            ctxenlargeIn -= 1
            if ctxenlargeIn == 0:
                ctxenlargeIn = math.pow(2, ctxNBits)
                ctxNBits += 1
            
            # Add wc to the dictionary.
            ctxDic[ctxwc] = ctxDicSz
            ctxDicSz += 1
            ctxw = str(ctxc)

    # Output the code for w.
    if ctxw != "":
        if ctxw in ctxDicToCreate:
            if ord(ctxw[0]) < 256:
                for i in range(ctxNBits):
                    ctxDtVal = (ctxDtVal << 1)
                    if ctxDtPos == bitsPerChar-1:
                        ctxDtPos = 0
                        ctxDt.append(getCharFromInt(ctxDtVal))
                        ctxDtVal = 0
                    else:
                        ctxDtPos += 1
                val = ord(ctxw[0])
                for i in range(8):
                    ctxDtVal = (ctxDtVal << 1) | (val & 1)
                    if ctxDtPos == bitsPerChar - 1:
                        ctxDtPos = 0
                        ctxDt.append(getCharFromInt(ctxDtVal))
                        ctxDtVal = 0
                    else:
                        ctxDtPos += 1
                    val = val >> 1
            else:
                val = 1
                for i in range(ctxNBits):
                    ctxDtVal = (ctxDtVal << 1) | val
                    if ctxDtPos == bitsPerChar - 1:
                        ctxDtPos = 0
                        ctxDt.append(getCharFromInt(ctxDtVal))
                        ctxDtVal = 0
                    else:
                        ctxDtPos += 1
                    val = 0
                val = ord(ctxw[0])
                for i in range(16):
                    ctxDtVal = (ctxDtVal << 1) | (val & 1)
                    if ctxDtPos == bitsPerChar - 1:
                        ctxDtPos = 0
                        ctxDt.append(getCharFromInt(ctxDtVal))
                        ctxDtVal = 0
                    else:
                        ctxDtPos += 1
                    val = val >> 1
            ctxenlargeIn -= 1
            if ctxenlargeIn == 0:
                ctxenlargeIn = math.pow(2, ctxNBits)
                ctxNBits += 1
            del ctxDicToCreate[ctxw]
        else:
            val = ctxDic[ctxw]
            for i in range(ctxNBits):
                ctxDtVal = (ctxDtVal << 1) | (val & 1)
                if ctxDtPos == bitsPerChar - 1:
                    ctxDtPos = 0
                    ctxDt.append(getCharFromInt(ctxDtVal))
                    ctxDtVal = 0
                else:
                    ctxDtPos += 1
                val = val >> 1

    ctxenlargeIn -= 1
    if ctxenlargeIn == 0:
        ctxenlargeIn = math.pow(2, ctxNBits)
        ctxNBits += 1

    # Mark the end of the stream
    val = 2
    for i in range(ctxNBits):
        ctxDtVal = (ctxDtVal << 1) | (val & 1)
        if ctxDtPos == bitsPerChar - 1:
            ctxDtPos = 0
            ctxDt.append(getCharFromInt(ctxDtVal))
            ctxDtVal = 0
        else:
            ctxDtPos += 1
        val = val >> 1

    # Flush the last char
    while True:
        ctxDtVal = (ctxDtVal << 1)
        if ctxDtPos == bitsPerChar - 1:
            ctxDt.append(getCharFromInt(ctxDtVal))
            break
        else:
           ctxDtPos += 1

    return "".join(ctxDt)

def _lzd(int length, int resetVal, getNxVal): #decompress function
    cdef int enlargeIn, dictSize, numBits, i, bits, power, next, maxpower
    dictionary = {}
    enlargeIn = 4
    dictSize = 4
    numBits = 3
    entry = ""
    result = []

    dt = Object(
        val=getNxVal(0),
        pos=resetVal,
        idx=1
    )

    for i in range(3):
        dictionary[i] = i

    bits = 0
    maxpower = math.pow(2, 2)
    power = 1

    while power != maxpower:
        resb = dt.val & dt.pos
        dt.pos >>= 1
        if dt.pos == 0:
            dt.pos = resetVal
            dt.val = getNxVal(dt.idx)
            dt.idx += 1

        bits |= power if resb > 0 else 0
        power <<= 1;

    next = bits
    if next == 0:
        bits = 0
        maxpower = math.pow(2, 8)
        power = 1
        while power != maxpower:
            resb = dt.val & dt.pos
            dt.pos >>= 1
            if dt.pos == 0:
                dt.pos = resetVal
                dt.val = getNxVal(dt.idx)
                dt.idx += 1
            bits |= power if resb > 0 else 0
            power <<= 1
        c = chr(bits)
    elif next == 1:
        bits = 0
        maxpower = math.pow(2, 16)
        power = 1
        while power != maxpower:
            resb = dt.val & dt.pos
            dt.pos >>= 1
            if dt.pos == 0:
                dt.pos = resetVal;
                dt.val = getNxVal(dt.idx)
                dt.idx += 1
            bits |= power if resb > 0 else 0
            power <<= 1
        c = chr(bits)
    elif next == 2:
        return ""

    dictionary[3] = c
    w = c
    result.append(c)
    counter = 0
    while True:
        counter += 1
        if dt.idx > length:
            return ""

        bits = 0
        maxpower = math.pow(2, numBits)
        power = 1
        while power != maxpower:
            resb = dt.val & dt.pos
            dt.pos >>= 1
            if dt.pos == 0:
                dt.pos = resetVal;
                dt.val = getNxVal(dt.idx)
                dt.idx += 1
            bits |= power if resb > 0 else 0
            power <<= 1

        c = bits
        if c == 0:
            bits = 0
            maxpower = math.pow(2, 8)
            power = 1
            while power != maxpower:
                resb = dt.val & dt.pos
                dt.pos >>= 1
                if dt.pos == 0:
                    dt.pos = resetVal
                    dt.val = getNxVal(dt.idx)
                    dt.idx += 1
                bits |= power if resb > 0 else 0
                power <<= 1

            dictionary[dictSize] = chr(bits)
            dictSize += 1
            c = dictSize - 1
            enlargeIn -= 1
        elif c == 1:
            bits = 0
            maxpower = math.pow(2, 16)
            power = 1
            while power != maxpower:
                resb = dt.val & dt.pos
                dt.pos >>= 1
                if dt.pos == 0:
                    dt.pos = resetVal;
                    dt.val = getNxVal(dt.idx)
                    dt.idx += 1
                bits |= power if resb > 0 else 0
                power <<= 1
            dictionary[dictSize] = chr(bits)
            dictSize += 1
            c = dictSize - 1
            enlargeIn -= 1
        elif c == 2:
            return "".join(result)


        if enlargeIn == 0:
            enlargeIn = math.pow(2, numBits)
            numBits += 1

        if c in dictionary:
            entry = dictionary[c]
        else:
            if c == dictSize:
                entry = w + w[0]
            else:
                return None
        result.append(entry)

        # Add w+entry[0] to the dictionary.
        dictionary[dictSize] = w + entry[0]
        dictSize += 1
        enlargeIn -= 1

        w = entry
        if enlargeIn == 0:
            enlargeIn = math.pow(2, numBits)
            numBits += 1


class LZString(object):
    def __init__(self, key):
        self.keyStr = key #or "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

    @staticmethod
    def compress(src):
        return _lzc(src, 16, chr)

    @staticmethod
    def toUTF16(src):
        if src is None:
            return ""
        return _lzc(src, 15, lambda a: chr(a+32)) + " "

    def toBase64(self, src):
        if src is None:
            return ""
        #res = _lzc(src, 6, lambda a: self.keyStr[a])
        # # To produce valid Base64
        # end = len(res) % 4
        # if end > 0:
        #     res += "="*(4 - end)
        #return res
        return _lzc(src, 6, lambda a: self.keyStr[a])

    def toEncodedURI(self, src):
        if src is None:
            return ""
        return _lzc(src, 6, lambda a: self.keyStr[a])

    @staticmethod
    def decompress(src):
        if src is None:
            return ""
        elif src == "":
            return None
        return _lzd(len(src), 32768, lambda i: ord(src[i]))

    @staticmethod
    def fromUTF16(src):
        if src is None:
            return ""
        elif src == "":
            return None
        return _lzd(len(src), 16384, lambda i: ord(src[i]) - 32)

    def fromBase64(self, src):
        if src is None:
            return ""
        elif src == "":
            return None
        return _lzd(len(src), 32, lambda i: _bVal(self.keyStr, src[i]))

    def fromEncodedURI(self, src):
        if src is None:
            return ""
        elif src == "":
            return None
        src = src.replace(" ", "+")
        return _lzd(len(src), 32, lambda i: _bVal(self.keyStr, src[i]))

    def toBase128(self, src):
        if src is None:
            return ""
        # res = _lzc(src, 7, lambda a: self.keyStr[a])
        ## To produce valid Base64
        # end = len(res) % 8
        # if end > 0:
        #     res += "="*(8 - end)
        # return res
        return _lzc(src, 7, lambda a: self.keyStr[a])

    def fromBase128(self, src):
        if src is None:
            return ""
        elif src == "":
            return None
        return _lzd(len(src), 64, lambda i: _bVal(self.keyStr, src[i]))
#endregion LZString

#region SessionId
def hashSId(str s, str p, str q): #calculating hash
    cdef int b, x, y, l, h, o, i, n, 
    k = genKey(5)
    b = 5
    x = 0
    y = 0
    l = len(p)
    h = len(q)
    #print(sHash)
    j = len(s)
    for i in range(j):
        o = ord(s[i])
        x ^= o ^ ord(p[i%l])
        y ^= o ^ ord(q[i%h])
    n = (2**b) - 1
    #print(x, y, x & n, y & n, (x >> b) | ((y >> b) << (8-b)))
    return k[x & n] + k[y & n] + k[(x >> b) | ((y >> b) << (8-b))]

def sessionId():
    from uuid import uuid4
    u = uuid4().bytes
    s = ""
    for i in u:
        s += chr(i)
    return BNE().Enc(s) #BNE(6, genKey(2)).Enc(s)

def isValidSId(str s, str p, str q):
    x = -3
    if hashSId(s[:x], p, q) == s[x:]:
        return True
    else:
        return False

#endregion SessionId