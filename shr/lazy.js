/*
mod : Lazy service
cre : lwx 20190114
upd : lwx 20200923
ver : 1.3
*/

appFactory(_LazyService, [
_$q, _$http, _CONFIG, _Global,
function($q, $http, CONFIG, Global) {
    'use strict';

    var promisesCache = {},
        _counter = "_C_",
    _load = function(name, nonEncrypted) {
        var path = CONFIG.app + name + (CONFIG.v || ""),
            promise = promisesCache[name];
        if (!promise) {
            promise = $http.get(path);
            promisesCache[name] = promise;
            return promise.then(function(result) {
                var i, l,
                codeStr = ['appController','appFactory','appService'],
                runStr = ['z.c','z.f','z.s'],
                jsBody = nonEncrypted?result.data:Global.f().b(result.data);
                for (i=0,l=getLength(codeStr);i<l;i++){
                    jsBody = jsBody.replace(codeStr[i],runStr[i]);
                }
                if (Global.a(_counter)<=0){
                    window.z = appRegister;
                    //console.log("set window.z = appRegister;");
                } //else {
                //    console.log("_counter = ", Global.a(_counter));
                //}
                Global.a(_counter, Global.a(_counter)+1);
                //console.log("_counter = ", Global.a(_counter));
                // better use lzstring here
                $q.when(Function('"use strict"; ' + jsBody)()).then(function(){
                    Global.a(_counter, Global.a(_counter)-1);
                    if (Global.a(_counter)<=0){
                        window.z = CONST_NULL;
                        //console.log("set window.z = CONST_NULL;");
                    }
                });
                //Function('"use strict"; ' + jsBody)();
                //console.info('Loaded: ' + path);
            });
        }
        return promise;
    };

    if (!Global.a(_counter)){
        Global.a(_counter, 0);
        //console.log("set _counter", Global.a(_counter));
    } //else{
    //    console.log("_counter already set", Global.a(_counter));
    //}

    return {
        l: function(name, nonEncrypted) {
            if (angularIsArray(name)){
                var deferred = $q.defer(),
                map = name.map(function(nm) {
                    return _load(nm, nonEncrypted);
                });
                $q.all(map).then(function(){
                    deferred.resolve();
                });
                return deferred.promise;
            } else {
                return _load(name, nonEncrypted);
            }
        }
    };
}]);