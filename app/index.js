/*
mod : Index controller
cre : lwx 20180428
upd : devin 20210410
ver : 1.2
*/

appController('cIndex', [
_$scope, _$rootScope, _$location, _$q, "$interval", "$route", "$routeParams", "$window", _CONFIG, _Global, _API,
function ($scope, $rootScope, $location, $q, $interval, $route, $routeParams, $window, CONFIG, Global, svcRestAPI) {
    'use strict';
    var
    _menu1, _menu2,
    _emptyString = "",
    _TITLE = "_t",
    _ICO = "_i",
    _Copyright = "Copyright",
    //_XTOKEN = 'X-A',
    _urlBackTo = CONST_NULL,
    _userInfo = CONST_NULL,
    _mathFloor = Math.floor,
    _dateNow = Date.now,
    _i1000 = 1000,
    _alertIdCounter = 0,
    _timer = CONST_NULL,
    _timerSubscriber = [],
    _timerIdCounter = 0,
    _timerFunction = 
    /**
     * subscribe or unsubscribe a timer
     * @param {number} intervalInSecondsOrTimerIdCounter when subscribe number in second, when unsubscribe the timer id
     * @param {timerEventCallback} callback call back function
     * @param {boolean} noRepeat pass true if don't want to repeat
     * @example
     *  var timerId = $scope._T(1, callbackFunction); //Subscribe a timer for 1 second
     *  $scope._T(timerId); //unsubscribe to timer
     */
    function(intervalInSecondsOrTimerIdCounter, callback, noRepeat){
        if(callback){ //Subscribe Timer
            //initialization here
            _timerIdCounter += 1;
            var obj = {i:_timerIdCounter, v:intervalInSecondsOrTimerIdCounter, c:callback, t:_mathFloor(_dateNow()/_i1000), n:noRepeat}
            _timerSubscriber.push(obj);
            if(!_timer){
                _timer = $interval(function(){
                    //for(var i =0, l = _timerSubscriber.length, t = _mathFloor(_dateNow()/_i1000); i<l; i++){
                    for(var i =0, l = getLength(_timerSubscriber), t = _mathFloor(_dateNow()/_i1000); i<l; i++){
                        var timerSubscriber = _timerSubscriber[i];
                        if(timerSubscriber.t+timerSubscriber.v <= t){
                            _timerSubscriber[i].t = t;
                            $q.when((timerSubscriber.c(), timerSubscriber)).then(function(timerSubscriber){
                                if(timerSubscriber.n){
                                    _timerFunction(timerSubscriber.i);
                                }
                            });
                        }
                    }
                }, _i1000);
            }
            return obj.i;
        } else { //UnSubcribe Timer
            for(var i =0, l = getLength(_timerSubscriber); i<l; i++){ //for(var i =0, l = _timerSubscriber.length; i<l; i++){
                if(_timerSubscriber[i].i == intervalInSecondsOrTimerIdCounter){
                    _timerSubscriber.splice(i,1);
                    break;
                }
            }
            if (getLength(_timerSubscriber)<1){ //if (_timerSubscriber.length<1){
                _destroy();
            }
        }
    }

    /**
     * callback when timer event fired
     * @callback timerEventCallback
     */

    ,
    _destroy = 
    /**
     * destroy timer
     */
    function() {
        //console.log("destroy");
        if (_timer){
            $interval.cancel(_timer);
            _timer = CONST_NULL;
        }
        if ($scope.lC){
            $scope.lC = CONST_NULL;
        }
    },
    _logBrowsingStatistic = 
    /**
     * Loging browsing statistic
     * @param {string} url route to log
     */
    function(url){ //log browsing statistic and get session id the first time log
        if(url){
            // svcRestAPI.p('h8ipt30yag9srdrlv1y6.lwx', {"a":url}).then(function(result){ //success
            //     //console.log(result);
            //     if (!Global.a(_XTOKEN)) { //if token not yet in Global, then save it
            //         Global.a(_XTOKEN, Global.d(result.headers(_XTOKEN), 2));
            //     }
            // }, svcRestAPI.e);
        }
    };

    //#region list of all $scope and $rootScope variables
    /*
    $scope:
        $scope.lId      current language id
        $scope.Product  product name
        $scope._t       page title
        $scope._l       loaded language holder
        $scope.lC       current language file file info
        $scope._i       page icon
        $scope._m       menu holder
        $scope._M       menu click function
        $scope._N       menu bar click function
        $scope._b       menu of menu bar
        $scope._a       alert containner
        $scope._x       close alert function
        $scope._d        if true show menu overlay
        $scope._Tm      Current theme
    $rootScope:
        $rootScope.$    document.getElementById
        $rootScope._T   _timerFunction
        $rootScope._S   return _XTOKEN
        $rootScope._L   Load language file or Set language Id
        $rootScope._G   Get saved UrlBack or Go back to saved UrlBack or goto Login page or Goto certain page and save current page as UrlBack
        $rootScope._A   set alert
        $rootScope._U   set or get user info
        $rootScope.info CONFIG[_Copyright]
        $rootScope.PGENUM   page enum constant
        $rootScope.addMenu  temporarry function to add menu
        $rootScope._cTm  function change Theme: set $scope._Tm
        $rootScope._ScrS if screen width < 601 then true small
        $rootScope._ScrL if screen width > 992 then true large
    */
    //#endregion list of all $scope and $rootScope variables
    
    /* var INDEX_PATH = /^(\/|\/index[^.]*.htm)$/;
    if (!$location.path() || INDEX_PATH.test($location.path())) {
        $location.path('/').replace();
    } */

    //$rootScope.versionNumber = CONFIG.Copyright.Version;

    $scope.$route = $route;

    $rootScope._T = _timerFunction;

    //variable that hold whether screen size is small or not
    $rootScope._ScrS = $window.innerWidth<601?true:false;
    //variable that hold whether screen size is large or not
    $rootScope._ScrL = $window.innerWidth>992?true:false;
    
    $rootScope._ = 
    /**
     * Get html element by id
     * @param {string} id html element id
     * @example
     *  var myHTMLElement = $scope._('anId'); //accesing from any controller
     */
    function (id) {
        return document.getElementById(id);
    };

    //return token
    $rootScope._S = 
    /**
     * Get current session id
     * @returns {string} session id
     * @example
     *  var mySessionId = $scope._S(); //accesing from any controller
     */
    function(){
        return Global.a(_XTOKEN);
    }
    // Set Language Id to default Language Id
    $scope.lId = $routeParams.l || CONFIG.lDef;
    $scope.Product = CONFIG.Copyright.Product;

    //function set theme
    $rootScope._cTm = function(theme){
        $scope._Tm = theme;
    }
    //set default theme
    $rootScope._cTm("ipm-default");

    //$scope.isTitle = CONST_FALSE;

    $scope.$on('$routeChangeStart', function($event, current, previous) {
        //console.log(current.$$route.originalPath, previous)
        var r = current.$$route.originalPath;
        $scope._t = _emptyString;
        //$scope.title=CONST_NULL;
        if (r) {
            _logBrowsingStatistic(r);
        }
    });

    /* $scope.$on('$locationChangeStart', function (event, next, prev) {
        $scope.isTitle = CONST_FALSE;
        //$scope.title=CONST_NULL;
    }) */

    angularElement($window).on('resize', function () {
        $rootScope._ScrS = $window.innerWidth<601?true:false;
        $rootScope._ScrL = $window.innerWidth>992?true:false;
        $rootScope.$apply();
    }); 

    $scope.$on('$destroy', _destroy);

    //#region Set languageId and Load Language file
    /* sample call from controller:
        $scope._L(null, null, null, "en"); //<== set language id only
        $scope._L($scope, "m/company.json", null, "en"); //<==Load language file
    */
    $rootScope._L = 
    /**
     * Set languageId or loading language file
     * @param {object} scope caller controller object
     * @param {string} fJSON url to the JSON language file
     * @param {loadLangCallback} callback optional callback function
     * @param {string} langId language id e.g.: 'en' or 'id'
     * @param {number} tryCount don't pass anything to this parameter when call this function
     * @example
     *  $scope._L(null, null, null, "en"); //<== set language id only
     *  $scope._L($scope, "m/company.json"); //<==Load language file
     *  $scope._L($scope, "a/login.json", $scope.callBackFunction); //<==Load language file and pass a callback function
     */
    function (scope, fJSON, callback, langId, tryCount) {
        if (angularIsDefined(langId)){
            if (!scope && !fJSON){ //only set lang id and load current language file if exist
                $scope.lId = langId;
                if (angularIsUndefined(scope) && angularIsDefined($scope.lC)){
                    $rootScope._L($scope.lC.s, $scope.lC.j, $scope.lC.c);
                }
                return;
            }
        } else{
            langId = $scope.lId;
        }
        //console.log("start to get language file:", fJSON, langId, tryCount, CONFIG.lDir + langId + '/' + fJSON + '.json');
        //loading language file
        svcRestAPI.l(fJSON, langId).then(function (result) {
            //console.log("get language file:", response);
            var langData = result.data;
            // set html title
            //$scope[_TITLE] = langData._t? ($scope.isTitle = CONST_TRUE, langData._t) : ($scope.isTitle = CONST_FALSE, _emptyString);
            $scope[_TITLE] = langData._t? langData._t : _emptyString;
            $scope[_ICO] = langData._i? langData._i : _emptyString;

            // returnning result
            if (angularIsFunction(scope)) {
                scope(langData);
            } else {
                scope._l = langData;
            }
            //saving Current lang loaded
            $scope.lC = {
                s: scope,
                j: fJSON,
                c: callback
            };
            if(callback && angularIsFunction(callback)){
                callback();
            }
        }), function () { //parameter:data  //error load language file
            //console.log("un able to get language file:", data);
            if (angularIsUndefined(tryCount)) {
                $rootScope._L(scope, fJSON, callback, CONFIG.lDef, 1) // get default language
            }
        };
    };
    /**
     * Loading language file callback
     * @callback loadLangCallback
     */

    //Should be removed, new implementation should use _L instead
    $rootScope.setTitle = function (title, ico) {
        //console.log(title,ico);
        $scope[_TITLE] = title;
        //$scope.isTitle = CONST_TRUE;
        if (ico) {
            $scope._i = ico;
        }
    };
    $rootScope._L($scope, 'index');
    //#endregion Set languageId and Load Language file

    //goto url
    //var a = $scope._G() : get saved urlBackTo to a
    //$scope._G(0) : goto saved urlBackTo
    //$scope._G(1) : goto login
    //$scope._G('setting', '/') : goto setting and set UrlBack to /
    //$scope._G('chpwd') : goto chpwd and save current route to UrlBack
    $rootScope._G = 
    /**
     * goto route and save previous route
     * @param {string} urlTo set new route to go to
     * @param {string} urlBackTo optional set route to go back to when call. if ommited set to current route
     * @returns {string} saved urlBackTo to
     * @example
     *  var a = $scope._G(); //get saved urlBackTo to a
     *  $scope._G(0); //goto saved urlBackTo
     *  $scope._G(1); //goto login
     *  $scope._G('setting', '/'); //goto setting and set UrlBack to /
     *  $scope._G('chpwd'); //goto chpwd and save current route to UrlBack
     */
    function (urlTo, urlBackTo) {
        //console.log(0, "urlTo:", urlTo, "urlBackTo:", urlBackTo, "_urlBackTo:", _urlBackTo);
        if (angularIsDefined(urlTo)) {
            if (angularIsNumber(urlTo)){
                if (urlTo == 0){ //goto saved urlBackTo
                    urlTo = _urlBackTo;
                } else if (urlTo == 1){ //goto login
                    _urlBackTo = urlBackTo?urlBackTo:$location.url();
                    //console.log(1, "urlTo:", urlTo, "urlBackTo:", urlBackTo, "_urlBackTo:", _urlBackTo);
                    urlTo = CONFIG.urlAuth;
                } else { //don't understand the request, don nothing and return
                    return '';
                }
            } else {
                _urlBackTo = urlBackTo?urlBackTo:$location.url();
            }
        } else { //return saved urlBackTo
            return _urlBackTo;
        }
        //console.log(2, "urlTo:", urlTo, "urlBackTo:", urlBackTo, "_urlBackTo:", _urlBackTo);
        $location.url(urlTo).replace();
    };

    //Set or get user info
    $rootScope._U = 
    /**
     * if login successfull call this function to set user info
     * @param {object} userInfo user info object
     */
    function (userInfo) {
        if (userInfo){ //set user info
            _userInfo = userInfo;
            $scope._u = userInfo;
        } else { // get user info
            return _userInfo;
        }
    };
    //this is temporraly
    $rootScope._U({
        n: 'lwx'
        //id: ''
    });

    $rootScope.PGENUM = {
        Search: 1,
        Detail: 2
    };

    //menu bar menu
    $scope._b = [
        {
            r: "/",
            g: "globe",
            s: CONST_TRUE,
            m: CONFIG._m
        },
        {
            r: "project/dashboard",
            g: "puzzle-piece",
            s: CONST_FALSE,
            m: CONFIG._n
        }
    ];
    //Global.a("M", CONFIG._m);
    //_menu1 = CONFIG._m; //Global.a("M");
    $scope._m = CONFIG._m; //Global.a("M");
    CONFIG._m = CONST_NULL;
    //console.log($scope._m);
    //_menu2 = CONFIG._n;
    CONFIG._n = CONST_NULL;
    // menu click
    $scope._M = function(m) {
        //console.log("mnuClick:",m,cmd);
        if(m){
            $scope._d = CONST_FALSE; //$scope._d==true ==> display panel and overlay
            $location.url(m);
        } else {
            $scope._d = !$scope._d;
        }
    }
    // group menu click
    $scope._N = function(route){
        //clear selected flag
        for(var i=0,l=$scope._b.length;i<l;i++){
            if ($scope._b[i].r == route.r){
                $scope._b[i].s = CONST_TRUE;
            } else {
                $scope._b[i].s = CONST_FALSE;
            }
        }
        $scope._m = route.m;
        //change the tree view menu item
        //console.log(route);
        // if (route.r =="/"){
        //     $scope._m = route.m;
        //     //$scope.$emit('tvmCh', _menu1);
        //     //console.log("_menu1:", _menu1);
        // } else {
        //     $scope._m = route.m;
        //     //$scope.$emit('tvmCh', _menu2);
        //     //console.log("_menu2:", _menu2);
        // }
        //$scope.$apply();
        //$scope.$broadcast('tvmCh', $scope._m);
        //console.log("route:", route, "$scope._m:", $scope._m);
        //goto expected route
        //$location.url(route);
    };

    //sample adding menu. Must delete when production
    /* $rootScope.addMenu = function(){
        var m=$scope._m[getLength($scope._m)-1]; //var m=$scope._m[$scope._m.length-1];
        if(m.c){
            m.c.push({
                r: '/moresample',
                g: 'cog',
                d: 'moresample'
            });
            $scope.$emit('tvmCh', $scope._m);
        }
        //console.log('Global.M:', Global.a("M"), '$scope._m', $scope._m);
    } */

    //#region alert
    $scope._a=[]; //alert containner
    //addAlert
    $rootScope._A = function(msg, sClass, title, autoCloseInSecond, disableCloseButton){
        _alertIdCounter += 1;
        var obj = {m:msg,t:title,c:sClass?sClass:_emptyString,d:_mathFloor(_dateNow()/_i1000),s:autoCloseInSecond,b:disableCloseButton,i:_alertIdCounter};
        $scope._a.unshift(obj); //$scope._a.push(obj);
        if(autoCloseInSecond){
            _timerFunction(autoCloseInSecond, function(){$scope._x(obj.i);}, CONST_TRUE);
        }
    };
    //closeAlert
    $scope._x = function(id){
        //console.log("$scope.x:", id);
        for(var i=0,l=getLength($scope._a);i<l;i++){ //for(var i=0,l=$scope._a.length;i<l;i++){
            if($scope._a[i].i==id){
                $scope._a.splice(i,1);
                //console.log($scope._a.length);
                break;
            }
        }
    };
    // //alert sample
    // $rootScope._A('First');
    // $rootScope._A('2nd',"w3-blue-grey");
    // $rootScope._A('3rd, <a ng-click="_G(1)">must login</a>',"w3-yellow",_emptyString);
    // $rootScope._A("4th, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non massa vitae risus fermentum ullamcorper. Phasellus risus urna, ornare in aliquam id, porttitor sit amet sapien. Nulla facilisi.","w3-blue-grey","Title",3,CONST_TRUE);
    // $rootScope._A("5th, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non massa vitae risus fermentum ullamcorper. Phasellus risus urna, ornare in aliquam id, porttitor sit amet sapien. Nulla facilisi.","w3-blue-grey","Title",5,CONST_FALSE);
    //#endregion alert

    $rootScope.info = CONFIG[_Copyright];
    //load info here
    svcRestAPI.g('info').then(function (result) {
        if (result.data.s == 0) {
            //console.log(result);
            $rootScope.info = result.data.d;
            CONFIG[_Copyright] = $rootScope.info;
        } else svcRestAPI.e(result);
    }, svcRestAPI.e);

    $scope.sideChildMenu = false
    $scope.sideChildMenuIndex = null
    $scope._goRoute = function(x, i){
        if(x.t === 0){
            $location.path(x.r)
        }else{
            $scope.sideChildMenu = true
            $scope.sideChildMenuIndex = i
        }
    }
    $rootScope._goTo = function(x){
        $location.path(x)
    }

    $rootScope._goBack = function(){
        window.history.back();
    }

    // $scope.isSidebar = true;
    // $scope.sidebarToggle = function(){
    //     $scope.isSidebar = !$scope.isSidebar
    // }
}]);