
def myOuterFunc(myArg):
    @myDecor
    def innerFunc(row, myArg):
        if row["field"] == myArg["r"]:
            return True
        else:
            return False
    def myDecor(fn):

        if row["field"] == innerArg["r"]:
            return True
        else:
            return False
    F1 = innerFunc
    F2 = innerFunc2
    result = r.table(tbName).filter(F1).run(self.getConn(), time_format="raw")
    result = r.table(tbName).filter(F2).run(self.getConn(), time_format="raw")
    #myInnerResult = innerFunc({})
    return myInnerResult

def myRouteF(myArg):
    def filterRow(myArg):
        def innerF(row)
            if row["field"] == myArg["r"]:
                return True
            else:
                return False
        return innerF
    myFilter = filterRow(myArg)
    result = r.table(tbName).filter(myFilter).run(self.getConn(), time_format="raw")
    #myInnerResult = innerFunc({})
    return myInnerResult
