/*
mod : Router Functionality
cre : lwx 20190610
upd : lwx 20201026
ver : 1.2
*/

//#region RouteFunction
//appConstant(_RouteFunction, function($routeProvider, routes, appPath, version){ //parse and add route
appConstant(_RouteFunction, function(routes, CONFIG, $routeProvider){ //parse and add route
    $routeProvider = $routeProvider || CONFIG._R;
    var version = CONFIG.v || "",
    keyMap = {
        c: 'controller',
        t: 'template',
        u: 'templateUrl',
        s: 'resolve',
        /*
        a: 'controllerAs',
        v: 'resolveAs',
        d: 'redirectTo',
        sd: 'resolveRedirectTo',
        lu: 'reloadOnUrl',
        ls: 'reloadOnSearch',
        m: 'caseInsensitiveMatch',
        active
        section
        pageTitle
        pageDesc
        pageImage
        */
    },
    parseResolve = function(resolve){
        var newObject={};
        angularForEach(resolve, function(value, key){
            //if (String(key).charAt(0) != '$'){ //should be no need to check for angular object
                var obj = this;
                if (angularIsString(value)){
                    obj[key] = [_LazyService, function(lazy){ return lazy.l(value); }]
                } else if(angularIsArray(value)) {
                    obj[key] = [_LazyService, function(lazy){ return lazy.l(value[0], value[1]); }]
                } else { //if(angularIsArray(value) || angularIsFunction(value))
                    obj[key] = value;
                }
            //}
        }, newObject);
        return newObject;
    },
    obj;
    angularForEach(routes, function(objRoute){
        obj={};
        angularForEach(objRoute[1], function(value, key){
            if(keyMap[key]){
                if(key=='u'){
                    value = CONFIG.app + value + version;
                } else if(key == 's'){
                    value = parseResolve(value);
                }
                key = keyMap[key];
            }
            obj[key] = value;
        });
        $routeProvider.when(objRoute[0], obj);
    });
});
//#endregion RouteFunction

//#region Route config
appConfig([
'$routeProvider', '$controllerProvider', '$provide', _CONFIG, _RouteFunction, //'$locationProvider', 
function($routeProvider, $controllerProvider, $provide, CONFIG, RouteFunction) { //, $locationProvider) {
    'use strict';

    //set html5 mode which is without "#!/" prefix
    //$locationProvider.html5Mode(true).hashPrefix('!');

    appRegister = { // set to window.z by lazy.js when lazy loading in progress
        c: $controllerProvider.register,
        f: $provide.factory,
        s: $provide.service
    };
    //window.z.r = $controllerProvider.register;
    //console.log(z);
    CONFIG._R = $routeProvider; //save route provider for use when adding dynamic route

    RouteFunction(CONFIG._r, CONFIG, $routeProvider);

    $routeProvider.otherwise(CONFIG._rD);

    CONFIG._r = CONST_NULL;  //routes registered, freeup memory
    CONFIG._rD = CONST_NULL; //routes registered, freeup memory

}]);
//#endregion Route config