/*
Product : hris
Copyright : Lisoft 
ver : 1.0
*/
(function(window, angular) {


/*

 Start ./../www/app/../gf/gf.js 

*/

/*

 End ./../www/app/../gf/gf.js 

*/


/*

 Start ./../www/app/app.js 

*/
/*
mod : main app entry point
cre : lwx 20180428
upd : lwx 20201026
ver : 1.1
*/

var
_APPCFG = window._CFG,
app = angular.module(_APPCFG.appCode, _APPCFG.appDependcies),
CONST_NULL = null,
CONST_TRUE = true,
CONST_FALSE = !CONST_TRUE,
angularForEach = angular.forEach,
angularIsArray = angular.isArray,
angularIsNumber = angular.isNumber,
angularIsDefined = angular.isDefined,
angularIsUndefined = angular.isUndefined,
angularElement = angular.element,
angularIsString = angular.isString,
angularIsFunction = angular.isFunction,
// angularCopy = angular.copy,
// angularEquals = angular.equals,
appConstant = app.constant,
appConfig = app.config,
appFactory = app.factory,
appController = app.controller,
appDirective = app.directive,
appRegister = CONST_NULL,
_LWX = "Li Weixia",
_CONFIG = 'C', //'CONFIG'
_Global = 'G', //'Global' service
_API = 'A', //'Rest' API service
_WebSocket = 'S', //'WebSocket' service: ws.js
_LazyService = 'Y', //app.factory(_LazyService, ...) in lazy.js
_RouteFunction = 'R', //app.constant(_RouteFunction, ...) in route.js
_$http = '$http',
_$scope = '$scope',
_$rootScope = '$rootScope',
_$location = '$location',
_$compile = '$compile',
_$parse = '$parse',
_$q = '$q',
_XTOKEN = 'XA',
angularElementSetAttrOrAppend = 
    /**
     * Set an element attribute if value provided else add elemnt to parrent
     * @param {object} element an html element
     * @param {object} attrOrElement an html element or attribute name
     * @param {any} val  attribute value
     */
    function(element, attrOrElement, val){
        if(val){
            element.attr(attrOrElement, val); //set attribute's value of an element
        } else {
            return element.append(attrOrElement); //add child element(s) to an element
        }
    },
isNull = 
    /**
     * check if a variable is equal to null
     * @param {any} val any variable to check
     * @returns true if val==null otherwise return false
     */
    function(val){
        return val == CONST_NULL? CONST_TRUE : CONST_FALSE;
    },
getLength = 
    /**
     * return length of an object
     * @param {any} obj any
     */
    function(obj){
        return obj.length;
    }
;

//never use this Copyright info here, it is a decoy because can be intercepted and change. Instead use $rootScope.info which get the info from api
appConstant(_CONFIG, _APPCFG);
window._CFG = CONST_NULL;
/*

 End ./../www/app/app.js 

*/


/*

 Start ./../www/app/../shr/modal.js 

*/
/*
mod : modal view directive. Wrap html template inside a modal view
cre : lwx 20190129
upd : lwx 20190129
ver : 1.0
*/
appDirective("mv", [_$compile, function($compile) {

    return {
        restrict: "E",
        //bindToController: CONST_FALSE,
        link: function($scope, element, attrs){ //, attrs
            var tagDiv = "<div></div>",
            attrClass = "class",
            attrStyle = "style",
            content = angularElement(tagDiv),
            elementContainer = angularElement(tagDiv);
            //sClass="w3-modal-content w3-show";
            if (angularIsDefined(attrs.title)){
                //add title
                angularElementSetAttrOrAppend(content, angularElement('<h3 class="w3-bar w3-blue">' + (attrs.ico?'<i class="fa fa-'+attrs.ico+'" style="padding:8px 8px 0 16px"></i>':'') + '{{' + attrs.title + '}}<i class="w3-right w3-button fa fa-close" ng-click="_x()"></i></h3>'));
                // Compile title
                $compile(content)($scope);
            }
            angularElementSetAttrOrAppend(content, attrClass, "w3-modal-content w3-show" + (angularIsDefined(attrs[attrClass])? " " + attrs[attrClass] : ""));
            if (angularIsDefined(attrs[attrStyle])){
                angularElementSetAttrOrAppend(content, attrStyle, attrs[attrStyle]);
            }
            angularElementSetAttrOrAppend(elementContainer, attrClass, "w3-container");
            angularElementSetAttrOrAppend(content, angularElementSetAttrOrAppend(elementContainer,element.contents()));
            content = angularElementSetAttrOrAppend(angularElement(tagDiv), content);
            angularElementSetAttrOrAppend(content, attrClass, "w3-modal w3-show w3-animate-opacity");
            // update DOM
            //element.empty();
            element.replaceWith(content);
        }
    };
}]);
/*

 End ./../www/app/../shr/modal.js 

*/


/*

 Start ./../www/app/../shr/tvm.js 

*/
/*
mod : tree view menu directive. creating a tree view menu
cre : lwx 20190129
upd : lwx 20201229
ver : 1.2
*/

appDirective("tvm", [
_$q, _$parse, _$compile, //'$document', '$timeout', _$http, '$templateCache',
function ($q, $parse, $compile) {//, $document, $timeout, $http, $templateCache) {
    return {
        restrict: "E",
        link: function($scope, element, attrs){
            var
            tagMenu = "<span></span>",
            attrClass = "class",
            /* buildTVM = function (menu, id){
                if (String(id).charAt(0) != '$') { // Don't process keys added by Angular...  See GitHub Issue #29
                    var newElement = CONST_NULL;
                    if(angularIsDefined(menu.c)){
                        var 
                        path = this[1] + '[' + id + ']',
                        mnuPath="mnu"+path+".o",
                        containerElement = angularElement(tagMenu);
                        //console.log('menu:', menu, 'id:', id)
                        //create group element as container
                        //containerElement = angularElement(tagMenu);
                        angularElementSetAttr(containerElement, attrClass, "mnu");
                        angularElementSetAttr(containerElement, "ng-show", mnuPath);
                        angularForEach(menu.c, buildTVM, [containerElement,path]);
                        newElement = angularElement('<span class="w3-hover-blue mnu"><i class="fa fa-'+menu.g+' famnuico"></i>'+menu.d+'<i class="fa fa-caret-{{'+mnuPath+'?\'down\':\'right\'}} famnuico"></i></span>');
                        angularElementSetAttr(newElement, "ng-click", mnuPath+"=!"+mnuPath + (angularIsDefined(menu.r)?";_M('"+menu.r+"')":""));
                        newElement = angularElement(tagMenu).append(newElement);
                        angularElementSetAttr(newElement, attrClass, "mnuGrpHover");
                        newElement.append(containerElement);
                    } else{
                        //create menu item
                        newElement = angularElement('<span class="w3-hover-blue mnu" '+'ng-click="_M(\''+menu.r+'\')"><i class="fa fa-'+menu.g+' famnuico"></i>'+menu.d+'</span>');
                    }
                    this[0].append(newElement);
                    newElement = CONST_NULL;
                }
            }, */
            buildTVM = function (menu, id){
                if (String(id).charAt(0) != '$') { // Don't process keys added by Angular...  See GitHub Issue #29
                    var path, mnuPath, containerElement, newElement = CONST_NULL;
                    //this[0].append(
                    angularElementSetAttrOrAppend(this[0],(
                        angularIsDefined(menu.c)?(
                            path = this[1] + '[' + id + ']',
                            mnuPath = attrs.d+path+".o",
                            containerElement = angularElement(tagMenu),
                            angularElementSetAttrOrAppend(containerElement, attrClass, "thm-menu-grp"),
                            angularElementSetAttrOrAppend(containerElement, "ng-show", mnuPath),
                            angularForEach(menu.c, buildTVM, [containerElement,path]),
                            newElement = angularElement('<span class="thm-menu"'+(this[1]==''?' style="padding:4px 0 4px 0"':'')+'><i class="fa fa-'+menu.g+' famnuico"></i>'+menu.d+'<i class="fa fa-caret-{{'+mnuPath+'?\'down\':\'right\'}} famnuico"></i></span>'),
                            angularElementSetAttrOrAppend(newElement, "ng-click", mnuPath+"=!"+mnuPath + (angularIsDefined(menu.r)?";_M('"+menu.r+"')":"")),
                            //newElement = angularElement(tagMenu).append(newElement),
                            newElement = angularElementSetAttrOrAppend(angularElement(tagMenu), newElement),
                            angularElementSetAttrOrAppend(newElement, attrClass, "mnuGrpHover"),
                            //newElement.append(containerElement)
                            angularElementSetAttrOrAppend(newElement, containerElement)
                        )
                        :angularElement('<span class="thm-menu"'+(this[1]==''?' style="padding:4px 0 4px 0"':'')+' ng-click="_M(\''+menu.r+'\')"><i class="fa fa-'+menu.g+' famnuico"></i>'+menu.d+'</span>')
                    ));
                }
            },
            render = function(data){
                var newElement = angularElement(tagMenu);
                element.empty();
                angularForEach(data, buildTVM, [newElement,""]);
                //  Compile and update DOM
                $compile(newElement)($scope);
                //element.append(newElement.contents());
                angularElementSetAttrOrAppend(element, newElement.contents());
                //element.replaceWith(newElement.contents());
            };
            //this code handle attribute data and dataUrl
            /* if (angularIsDefined(attrs.data) || angularIsDefined(attrs.dataUrl)){
                (attrs.data ? $q.when($parse(attrs.data)($scope)) :
                  $http.get(attrs.dataUrl, {cache: $templateCache}).then(function (result) {
                    $scope[attrs.data] = result.data;
                    return result.data;
                  })
                ).then(function (data){
                    render(data);
                });
            } */
            // //this code only handle attribute d (d=data)
            // if (angularIsDefined(attrs.d)){
            //     $q.when($parse(attrs.d)($scope)).then(function(data){
            //         //console.log("$scope:", $scope, "data:", data);
            //         render(data);
            //     });
            // }
            // //when tvmChange event fired, re render the tvm
            // $scope.$on('tvmCh', function (objEvent, data) {
            //     // render everything again i.e. reload the directive
            //     console.log("objEvent:", objEvent, "data:", data);
            //     render(data);
            // });

            //watch 
            $scope.$watch(
                function($scope) {
                    // Watch the 'compile' expression for changes.
                    return $scope.$eval(attrs.d);
                },
                render
            );
        }
    };
}]);
/*

 End ./../www/app/../shr/tvm.js 

*/


/*

 Start ./../www/app/../shr/alert.js 

*/
/*
mod : Showing alert
cre : lwx 20190316
upd : lwx 20190316
ver : 1.0
*/
appDirective("alr", [
_$q, _$parse, _$compile, //'$document', '$timeout', _$http, '$templateCache',
function ($q, $parse, $compile) {//, $document, $timeout, $http, $templateCache) {
    return {
        restrict: "E",
        link: function($scope, element, attrs){
            var //tagSpan = "<span></span>",
            attrClass = "class";
            //this code only handle attribute d (d=data)
            if (angularIsDefined(attrs.d)){
                $q.when($parse(attrs.d)($scope)).then(function(data){
                /*
                <div ng-repeat="a in al" class="alit {{a.c}}">
                    <span ng-hide="a.b" class="w3-button w3-display-topright" ng-click="_x(a.i)">x</span>
                    <b ng-show="a.t">{{a.t}}</b>
                    <p class="altx">{{a.m}}</p>
                    <alr d="a"/>
                </div>
                becomes:
                <div ng-repeat="a in al" class="alit {{a.c}}">
                    <alr d="a"/>
                </div>
                */
                var newElement = angularElement("<div>"), node = CONST_NULL;
                    element.empty();
                    if (!data.b){
                        node = angularElement("<span>x</span>");
                        angularElementSetAttrOrAppend(node, attrClass, "w3-button w3-display-topright");
                        angularElementSetAttrOrAppend(node, "ng-click", "_x(" + data.i + ")");
                        angularElementSetAttrOrAppend(newElement, node);
                    }
                    if (data.t){
                        node = angularElement("<b>" + data.t + "</b>");
                        angularElementSetAttrOrAppend(newElement, node);
                    }
                    node = angularElement("<p>" + data.m + "</p>");
                    angularElementSetAttrOrAppend(newElement, node);
                    //  Compile and update DOM
                    $compile(newElement)($scope);
                    //element.append(newElement.contents());
                    //angularElementSetAttrOrAppend(element, newElement.contents());
                    element.replaceWith(newElement.contents());
                });
            }
        }
    };
}]);
/*

 End ./../www/app/../shr/alert.js 

*/


/*

 Start ./../www/app/../shr/popup.js 

*/
/*
mod : Pop up modal view directive. Wrap html template inside a pop up modal view
cre : lwx 20190514
upd : lwx 20190514
ver : 1.0
*/
appDirective("pv", [_$compile, _LazyService, _$http, '$templateCache', function($compile, LazyService, $http, $templateCache) {
    return {
        restrict: "E",
        //bindToController: CONST_FALSE,
        link: function($scope, element, attrs){ //, attrs
            var 
            render = function(data, template){
                var newElement = angularElement('<div' + (angularIsDefined(data.c)?' ng-controller="' + data.c + '"':'') + '>' + template + '</div>');
                //  Compile and update DOM
                $compile(newElement)($scope);
                element.empty();
                //element.append(newElement.contents());
                angularElementSetAttrOrAppend(element, newElement.contents());
            };
            //this code only handle attribute d (d=data)
            if (angularIsDefined(attrs.d)){
                $q.when($parse(attrs.d)($scope)).then(function(data){
                    (data.r?$q.when(LazyService.l(data.r)):{}).then(function(r){
                        $http.get(data.t, {cache: $templateCache}).then(function (result) {
                            render(data, result.data);
                        });
                    });
                });
            }
        }
    };
}]);
/*

 End ./../www/app/../shr/popup.js 

*/


/*

 Start ./../www/app/../shr/routeFunction.js 

*/
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
/*

 End ./../www/app/../shr/routeFunction.js 

*/


/*

 Start ./../www/app/../shr/global.js 

*/
/*
mod : Global
cre : lwx 20180428
upd : lwx 20190904
ver : 1.0
*/

appFactory(_Global, 
/**
 * Global service
 * @default
 * expose: {
 *  a: getSetValue(key:string, value:any) => any //set and get Global value. When value param provided means set value otherwise get value
 *  b: isValueExist(key) => boolean //check whether a key value saved to Global
 *  d: baseNDecrypt(source:string, edType:number|string, nBitLen:number) //base N bit per byte decrypt (default base 64)
 *  e: baseNEncrypt(source:string, edType:number|string, nBitLen:number) //base N bit per byte encrypt (default base 64)
 *  f: LZString(keynumber|string) //compress and decompress data
 *    a: toBase64(src)   // compress data to base 64
 *    b: fromBase64(src) // decompress data from base 64 string
 *    c: toB128(src)     // compress data to base 128 string
 *    d: fromB128(src)   // decompress data from base 128 string
 *    e: toUTF16(src)    // if want to save data to browser storage use this one
 *    f: fromUTF16(src)  // pair of toUTF16
 *    g: compress(src)   // generic compress method for binary result
 *    h: decompress(src) // generic decompress method from binary source
 *  g: getNewUUID(formated:boolean)
 *  h: genRandomStr(resultLength:number, keyType:number, additionalVarLen:number)
 *  i: searchObj(obj, key, value)
 *  t: trim(text:string, maxLength:number) //trim string and add ...
 * }
 */
function() {
'use strict';

    var _Value = {
        //"username": "",
        //"token": "",
        //"edxToken": "",
        //"email": "",
        //"profilePic": "",
        //"firstName": "",
        //"lastName": ""
    };

    //var _b64Key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    //!#$%&()*+,-.0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefghijklmnopqrstuvwxyz{|}~ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæ
    var
    _asciiBitAmt = 8,
    _defaultBaseNBitLen = 7,
    StringFromCharCode = String.fromCharCode,
    _mathPow = Math.pow,
    arrPush = function(arr, newItem){
        arr.push(newItem);
    },
    charCodeAt = function(src, idx){
        return src.charCodeAt(idx);
    },
    charAt = function(src, idx){
        return src.charAt(idx);
    },
    ObjectPrototypeHasOwnPropertyCall = function (context, prop){
        return Object.prototype.hasOwnProperty.call(context, prop);
    },
    //CONST_UNDEFINED = undefined,
    //CONST_KEYB64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    //CONST_KEYB64URISAFE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
    _getSvrKey = function(){
        var tmp = _Value[_LWX];
        //key should be encrypted too, so when hacker try to search from memory, it get something else
         return _nBitDec(tmp); //better save encrypted key in array not string
    },
    /**
     * Generate key
     * @param {number} keyType -1, 0, 1, 2, 9 (default -1)
     * @return {string} key
     */
    _genKey = function(keyType){
        var _As = 65,
            _Ze = 91,
            _as = 97,
            _ze = 123,
            _0s = 48,
            _9e = 58,
            _QuestionMark_s = 63, //?
            _Colon_e = 59, //:
            _Number_Sign_s = 35, //#
            _Ampersand_e = 39, //Terminate before 39 (& actually 38)
            _Left_Parenthis_s = 40, //(
            _FullStop_e = 47, //Terminate before 47, FullStop actually 46
            _LeftSquareBracket_e = 92, //Terminate before 92, [ actually 91
            _RightSquareBracket_s = 93, //]
            _Low_Line_e = 96, //Terminate before 96, _ actually 95
            _Tilde_e = 127, //Terminate before 127, ~ actually 126
            _LatinAwGrave_s = 192,
            _LatinSmall_ae_e = 231, //Terminate before 231, ae actually 230
            _key = "",
            suffix = "",
            arrRange = [_As,_Ze,_as,_ze,_0s,_9e], //[[_As,_Ze],[_as,_ze],[_0s,_9e]],
            i=0,j,k,l;
        if (keyType==0){ // standard base 64
            suffix = "+/=";
        }else if (keyType==1){ // non standard uri safe base 64
            suffix = "-_.";    // standard uri safe using "+-$"
        }else if (keyType==2){ // non standard base 64
            arrRange = [_as,_ze,_QuestionMark_s,_Ze,_0s,_Colon_e];
        }else if (keyType==9){ // key was from server and session specific after successfull login
            arrRange = [];
            _key = _getSvrKey();
        }else{ //own base 2 to base 128
            _key = "!";
            arrRange = [_Number_Sign_s,_Ampersand_e,_Left_Parenthis_s,_FullStop_e,_0s,_LeftSquareBracket_e,_RightSquareBracket_s,_Low_Line_e,_as,_Tilde_e,_LatinAwGrave_s,_LatinSmall_ae_e];
        };
        /* // not passed uglifyjs 
        for (i of arrRange) {
            for (j = i[0], k=i[1];j<k;j++){
                _key += StringFromCharCode(j);
            }
        } */
/*         for (l=getLength(arrRange);i<l;i++) { //for (l=arrRange.length;i<l;i++) {
            for (j = arrRange[i][0], k=arrRange[i][1];j<k;j++){
                _key += StringFromCharCode(j);
            }
        }
 */        for (l=getLength(arrRange);i<l;i+=2) { 
            for (j=arrRange[i], k=arrRange[i+1];j<k;j++){
                _key += StringFromCharCode(j);
            }
        }
        return _key + suffix;
    },
    
    _nBitEnc = function (source, baseNBitLen, key) {
        //return _bNE(baseNBitLen || 6, source, key);
        baseNBitLen = baseNBitLen || _defaultBaseNBitLen;
        key = key || _genKey();
        var binData = 0, bitLen = 0,
        baseNBit = _mathPow(2,baseNBitLen)-1,
        encResult = source.replace(/./g, function(v) {
            var encResultTmp = "";
            binData = (binData<<_asciiBitAmt) + charCodeAt(v, 0); //v.charCodeAt(0);
            bitLen += _asciiBitAmt;
            while (bitLen >= baseNBitLen){
                bitLen -= baseNBitLen;
                encResultTmp+=key[(binData >>> bitLen)&baseNBit];
                //binData = binData & (_mathPow(2,bitLen)-1);
            }
            return encResultTmp;
        });
        return bitLen>0?encResult+key[(binData<<(baseNBitLen-bitLen))&baseNBit]:encResult;
    },
    
    _nBitDec = function (source, baseNBitLen, key) {
        //return _bND(baseNBitLen || 6, source, key);
        baseNBitLen = baseNBitLen || _defaultBaseNBitLen;
        var binData = 0, bitLen = 0;
        key = key || _genKey();
        return source.replace(/./g, function(v) {
            binData = (binData << baseNBitLen) + key.indexOf(v);
            bitLen += baseNBitLen;
            return bitLen<_asciiBitAmt?'':StringFromCharCode((binData >>> (bitLen -= _asciiBitAmt)) & 0xff);
        })
    },
    /**
     * LZString compression
     * @param {number|string} sKey : -1, 0, 1, 2, 9 or key string
     * @returns {object} object
     */
    _LZString = function(sKey) {
        // private property
        var //f = String.fromCharCode,
        baseReverseDic = {},
        //_mathPow = Math.pow,
        _key = angularIsUndefined(sKey) ? _genKey() : angularIsNumber(sKey) ? _genKey(sKey) : sKey,

        _getBaseValue = function(alphabet, character) {
            if (!baseReverseDic[alphabet]) {
                baseReverseDic[alphabet] = {};
                for (var i = 0, l=getLength(alphabet); i < l; i++) { //for (var i = 0; i < alphabet.length; i++) {
                    baseReverseDic[alphabet][charAt(alphabet, i)] = i; //baseReverseDic[alphabet][alphabet.charAt(i)] = i;
                }
            }
            return baseReverseDic[alphabet][character];
        },

        _compress = function(uncompressed, bitsPerChar, getCharFromInt) {
            if (isNull(uncompressed)) return "";
            var i, value,
                context_dictionary = {},
                context_dictionaryToCreate = {},
                context_c = "",
                context_wc = "",
                context_w = "",
                context_enlargeIn = 2, // Compensate for the first entry which should not count
                context_dictSize = 3,
                context_numBits = 2,
                context_data = [],
                context_data_val = 0,
                context_data_position = 0,
                ii,
                uncompressedLength = getLength(uncompressed); //uncompressed.length;

            for (ii = 0; ii < uncompressedLength; ii += 1) {
                context_c = charAt(uncompressed, ii); //uncompressed.charAt(ii);
                //if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                if (!ObjectPrototypeHasOwnPropertyCall(context_dictionary, context_c)) {
                    context_dictionary[context_c] = context_dictSize++;
                    context_dictionaryToCreate[context_c] = CONST_TRUE;
                }

                context_wc = context_w + context_c;
                //if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                if (ObjectPrototypeHasOwnPropertyCall(context_dictionary, context_wc)) {
                    context_w = context_wc;
                } else {
                    //if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (ObjectPrototypeHasOwnPropertyCall(context_dictionaryToCreate, context_w)) {
                        if (charCodeAt(context_w, 0) < 256) { //if (context_w.charCodeAt(0) < 256) {
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    //context_data.push(getCharFromInt(context_data_val));
                                    arrPush(context_data, getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                            }
                            value = charCodeAt(context_w, 0); //context_w.charCodeAt(0);
                            for (i = 0; i < 8; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    //context_data.push(getCharFromInt(context_data_val));
                                    arrPush(context_data, getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        } else {
                            value = 1;
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1) | value;
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    //context_data.push(getCharFromInt(context_data_val));
                                    arrPush(context_data, getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = 0;
                            }
                            value = charCodeAt(context_w, 0); //context_w.charCodeAt(0);
                            for (i = 0; i < 16; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    //context_data.push(getCharFromInt(context_data_val));
                                    arrPush(context_data, getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        context_enlargeIn--;
                        if (context_enlargeIn == 0) {
                            context_enlargeIn = _mathPow(2, context_numBits);
                            context_numBits++;
                        }
                        delete context_dictionaryToCreate[context_w];
                    } else {
                        value = context_dictionary[context_w];
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                //context_data.push(getCharFromInt(context_data_val));
                                arrPush(context_data, getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }


                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = _mathPow(2, context_numBits);
                        context_numBits++;
                    }
                    // Add wc to the dictionary.
                    context_dictionary[context_wc] = context_dictSize++;
                    context_w = String(context_c);
                }
            }

            // Output the code for w.
            if (context_w !== "") {
                //if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (ObjectPrototypeHasOwnPropertyCall(context_dictionaryToCreate, context_w)) {
                    if (charCodeAt(context_w, 0) < 256) { //if (context_w.charCodeAt(0) < 256) {
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                //context_data.push(getCharFromInt(context_data_val));
                                arrPush(context_data, getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                        }
                        value = charCodeAt(context_w, 0); //context_w.charCodeAt(0);
                        for (i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                //context_data.push(getCharFromInt(context_data_val));
                                arrPush(context_data, getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    } else {
                        value = 1;
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                //context_data.push(getCharFromInt(context_data_val));
                                arrPush(context_data, getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = charCodeAt(context_w, 0); //context_w.charCodeAt(0);
                        for (i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                //context_data.push(getCharFromInt(context_data_val));
                                arrPush(context_data, getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = _mathPow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                } else {
                    value = context_dictionary[context_w];
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            //context_data.push(getCharFromInt(context_data_val));
                            arrPush(context_data, getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }


                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = _mathPow(2, context_numBits);
                    context_numBits++;
                }
            }

            // Mark the end of the stream
            value = 2;
            for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    //context_data.push(getCharFromInt(context_data_val));
                    arrPush(context_data, getCharFromInt(context_data_val));
                    context_data_val = 0;
                } else {
                    context_data_position++;
                }
                value = value >> 1;
            }

            // Flush the last char
            while (CONST_TRUE) {
                context_data_val = (context_data_val << 1);
                if (context_data_position == bitsPerChar - 1) {
                    //context_data.push(getCharFromInt(context_data_val));
                    arrPush(context_data, getCharFromInt(context_data_val));
                    break;
                } else context_data_position++;
            }
            return context_data.join('');
        },

        _decompress = function (length, resetValue, getNextValue) {
            var dictionary = [],
                next,
                enlargeIn = 4,
                dictSize = 4,
                numBits = 3,
                entry = "",
                result = [],
                i,
                w,
                bits, resb, maxpower, power,
                c,
                //data = { val: getNextValue(0), position: resetValue, index: 1 }
                data_val = getNextValue(0),
                data_position = resetValue,
                data_index = 1
                ;

            for (i = 0; i < 3; i += 1) {
                dictionary[i] = i;
            }

            bits = 0;
            maxpower = _mathPow(2, 2);
            power = 1;
            while (power != maxpower) {
                resb = data_val & data_position;
                data_position >>= 1;
                if (data_position == 0) {
                    data_position = resetValue;
                    data_val = getNextValue(data_index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }

            switch (next = bits) {
                case 0:
                    bits = 0;
                    maxpower = _mathPow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        resb = data_val & data_position;
                        data_position >>= 1;
                        if (data_position == 0) {
                            data_position = resetValue;
                            data_val = getNextValue(data_index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = StringFromCharCode(bits); //f(bits);
                    break;
                case 1:
                    bits = 0;
                    maxpower = _mathPow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        resb = data_val & data_position;
                        data_position >>= 1;
                        if (data_position == 0) {
                            data_position = resetValue;
                            data_val = getNextValue(data_index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = StringFromCharCode(bits); //f(bits);
                    break;
                case 2:
                    return "";
            }
            dictionary[3] = c;
            w = c;
            //result.push(c);
            arrPush(result, c);
            while (CONST_TRUE) {
                if (data_index > length) {
                    return "";
                }

                bits = 0;
                maxpower = _mathPow(2, numBits);
                power = 1;
                while (power != maxpower) {
                    resb = data_val & data_position;
                    data_position >>= 1;
                    if (data_position == 0) {
                        data_position = resetValue;
                        data_val = getNextValue(data_index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }

                switch (c = bits) {
                    case 0:
                        bits = 0;
                        maxpower = _mathPow(2, 8);
                        power = 1;
                        while (power != maxpower) {
                            resb = data_val & data_position;
                            data_position >>= 1;
                            if (data_position == 0) {
                                data_position = resetValue;
                                data_val = getNextValue(data_index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }

                        dictionary[dictSize++] = StringFromCharCode(bits); //f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 1:
                        bits = 0;
                        maxpower = _mathPow(2, 16);
                        power = 1;
                        while (power != maxpower) {
                            resb = data_val & data_position;
                            data_position >>= 1;
                            if (data_position == 0) {
                                data_position = resetValue;
                                data_val = getNextValue(data_index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = StringFromCharCode(bits); //f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 2:
                        return result.join('');
                }

                if (enlargeIn == 0) {
                    enlargeIn = _mathPow(2, numBits);
                    numBits++;
                }

                if (dictionary[c]) {
                    entry = dictionary[c];
                } else {
                    if (c === dictSize) {
                        entry = w + charAt(w,0); //w.charAt(0);
                    } else {
                        return CONST_NULL;
                    }
                }
                //result.push(entry);
                arrPush(result, entry);

                // Add w+entry[0] to the dictionary.
                dictionary[dictSize++] = w + charAt(entry,0); //entry.charAt(0);
                enlargeIn--;

                w = entry;

                if (enlargeIn == 0) {
                    enlargeIn = _mathPow(2, numBits);
                    numBits++;
                }

            }
        },

        _checkPad = function(src, padLength) {
            var needPad = getLength(src) % padLength; //var needPad = src.length % padLength;
            if (needPad > 0) {
                //src.padEnd(src.length + padLength - needPad, _key.charAt(_key.length - 1));
                //src.padEnd(src.length + padLength - needPad, charAt(_key,_key.length - 1));
                src.padEnd(getLength(src) + padLength - needPad, charAt(_key, getLength(_key) - 1));
            }
            return src;
        }

        return {
            /**
             * toBase64
             * @param {string} uncompressed Source string tobe compressed
             * @returns {string} compressed base64 string
             */
            a: function(uncompressed) { //toBase64
                if (isNull(uncompressed)) return "";
                //return _checkPad(_compress(uncompressed, 6, function(a) { return _key.charAt(a); }), 4);
                return _checkPad(_compress(uncompressed, 6, function(a) { return charAt(_key,a); }), 4);
                // switch (res.length % 4) { // To produce valid Base64
                //     default: // When could this happen ?
                //         case 0:
                //         return res;
                //     case 1:
                //             return res + "===";
                //     case 2:
                //             return res + "==";
                //     case 3:
                //             return res + "=";
                // }
            },
            /**
             * fromBase64
             * @param {string} compressed Base64 compressed string
             * @returns {string} orignial string
             */
            b: function(compressed) { //fromBase64
                if (isNull(compressed)) return "";
                if (compressed == "") return CONST_NULL;
                //return _decompress(compressed.length, 32, function(index) { return _getBaseValue(_key, compressed.charAt(index)); });
                //return _decompress(compressed.length, 32, function(index) { return _getBaseValue(_key, charAt(compressed,index)); });
                return _decompress(getLength(compressed), 32, function(index) { return _getBaseValue(_key, charAt(compressed,index)); });
            },
            /**
             * toB128
             * @param {string} uncompressed Source string tobe compressed
             * @returns {string} compressed base128 string
             */
            c: function(uncompressed) { //toB128
                if (isNull(uncompressed)) return "";
                //return _checkPad(_compress(uncompressed, 7, function(a) { return _key.charAt(a); }), 8);
                return _checkPad(_compress(uncompressed, 7, function(a) { return charAt(_key,a); }), 8);
            },
            /**
             * fromB128
             * @param {string} compressed Base128 compressed string
             * @returns {string} orignial string
             */
            d: function(compressed) { //fromB128
                if (isNull(compressed)) return "";
                if (compressed == "") return CONST_NULL;
                //return _decompress(compressed.length, 64, function(index) { return _getBaseValue(_key, compressed.charAt(index)); });
                //return _decompress(compressed.length, 64, function(index) { return _getBaseValue(_key, charAt(compressed,index)); });
                return _decompress(getLength(compressed), 64, function(index) { return _getBaseValue(_key, charAt(compressed,index)); });
            },
            /**
             * toUTF16
             * @param {Any} uncompressed data
             * @returns {Any} UTF16 string
             */
            e: function(uncompressed) { //toUTF16
                if (isNull(uncompressed)) return "";
                return _compress(uncompressed, 15, function(a) { return StringFromCharCode(a + 32); }) + " "; //f(a + 32); }) + " ";
            },
            /**
             * fromUTF16
             * @param {Any} compressed compressed data in UTF16 encoding
             * @returns {Any} original data
             */
            f: function(compressed) { //fromUTF16
                if (isNull(compressed)) return "";
                if (compressed == "") return CONST_NULL;
                //return _decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
                //return _decompress(compressed.length, 16384, function(index) { return charCodeAt(compressed, index) - 32; });
                return _decompress(getLength(compressed), 16384, function(index) { return charCodeAt(compressed, index) - 32; });
            },

            /* //compress into uint8array (UCS-2 big endian format)
            toUint8Array: function(uncompressed) {
                var compressed = LZString.compress(uncompressed);
                var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character
                for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
                    var current_value = compressed.charCodeAt(i);
                    buf[i * 2] = current_value >>> 8;
                    buf[i * 2 + 1] = current_value % 256;
                }
                return buf;
            }, */

            /* //decompress from uint8array (UCS-2 big endian format)
            fromUint8Array: function(compressed) {
                if (compressed === CONST_NULL || compressed === CONST_UNDEFINED) {
                    return LZString.decompress(compressed);
                } else {
                    var buf = new Array(compressed.length / 2); // 2 bytes per character
                    for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
                        buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
                    }
                    var result = [];
                    buf.forEach(function(c) {
                        result.push(StringFromCharCode(c)); //f(c));
                    });
                    return LZString.decompress(result.join(''));
                }
            }, */

            /* //compress into a string that is already URI encoded
            toEncodedURIComponent: function(input) {
                if (input == CONST_NULL) return "";
                return _compress(input, 6, function(a) { return CONST_KEYB64URISAFE.charAt(a); });
            }, */

            /* //decompress from an output of compressToEncodedURIComponent
            fromEncodedURIComponent: function(input) {
                if (input == CONST_NULL) return "";
                if (input == "") return CONST_NULL;
                input = input.replace(/ /g, "+");
                return _decompress(input.length, 32, function(index) { return _getBaseValue(CONST_KEYB64URISAFE, input.charAt(index)); });
            }, */
            /**
             * compress
             * @param {Any} uncompressed data tobe compressed
             * @returns {Any} compressed data
             */
            g: function(uncompressed) { //compress
                return _compress(uncompressed, 16, function(a) { return StringFromCharCode(a); }); //f(a); });
            },
            /**
             * decompress
             * @param {Any} compressed compressed data
             * @returns {Any} original data
             */
            h: function(compressed) { //decompress
                if (isNull(compressed)) {
                    return CONST_NULL;
                } else if (compressed == "") {
                    return "";
                } else {
                    //return _decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
                    //return _decompress(compressed.length, 32768, function(index) { return charCodeAt(compressed, index); });
                    return _decompress(getLength(compressed), 32768, function(index) { return charCodeAt(compressed, index); });
                }
            },

        };
        //return LZString;
    };

    return {
        /**
         * set and get Global value. When value param provided means set value otherwise get value
         * @param {string} key key
         * @param {any} value value
         * @returns {any} returns stored value when value param ommited
         * @example
         *      Global.a(keyString, value);
         *      var myVal = Global.a(keyString);
         */
        a: function(key, value) {
            if(angularIsDefined(value)){ //setValue
                _Value[key] = value;
            } else {
                return _Value[key]; //getValue
            }
        },
        /**
         * isValueExist check whether a key value saved to Global
         * @param {string} key key
         * @returns true if key value exist otherwise return false
         */
        b: function(key){ //isValueExist
            if(_Value[key]){
                return CONST_TRUE;
            } else {
                return CONST_FALSE;
            }
        },
        
        /**
         * base N bit per byte decrypt (default base 64)
         * @param {string} source encrypted source string
         * @param {number|string} edType decrypt type: -1, 0, 1, 2, 9 or key string
         * @param {number} nBitLen 6 for base 64, 7 for base 128, 5 for base 32, 4 for hexa decimal if passed key is "0123456789ABCDEF"
         * @example
         *  var myDecryptedString = Global.d(myEncryptedBase128String, 9) //using session dependend base64 key
         *  var myDecryptedString = Global.d(myEncryptedOwnBase64String) //using own base64 encrtption
         *  var myDecryptedString = Global.d(myEncryptedDefaultBase64String, 0) //using default base64 encrtption
         *  var myDecryptedString = Global.d(myEncryptedBase128String, -1, 7) //using default base128 encrtption
         */
        d: function(source, edType, nBitLen) {
            if (angularIsUndefined(edType)){ //default base 128 decrypt
                return _nBitDec(source);
            } else { //base 64 uri safe decrypt
                return _nBitDec(source, nBitLen || 6, angularIsNumber(edType)? _genKey(edType) : edType);
            }
        },

       /**
        * base N bit per byte encrypt (default base 64)
        * @param {string} source encrypted source string
        * @param {number|string} edType decrypt type: -1, 0, 1, 2, 9 or key string
        * @param {number} nBitLen 6 for base 64, 7 for base 128, 5 for base 32, 4 for hexa decimal if passed key is "0123456789ABCDEF"
        * @example
        *  var myEncryptedString = Global.enc(mySourceString, 9) //using session dependend base64 key
        *  var myEncryptedString = Global.enc(mySourceString) //using own base64 encrtption
        *  var myEncryptedString = Global.enc(mySourceString, 0) //using default base64 encrtption
        *  var myEncryptedString = Global.enc(mySourceString, -1, 7) //using default base128 encrtption
        */
        e: function(source, edType, nBitLen) {
            if (angularIsUndefined(edType)){ //default base 128 encrypt
                return _nBitEnc(source);
            } else { //base 64 uri safe encrypt
                return _nBitEnc(source, nBitLen || 6, angularIsNumber(edType)? _genKey(edType) : edType);
            }
        },

        /**
         * compress and decompress data
         * @param {number|string} skey -1, 0, 1, 2, 9 or key string
         *  -1 : using a 128 byte length key.
         *  0  : default base 64 key.
         *  1  : non standard uri safe key.
         *  2  : non standard base 64 key.
         *  9  : session dependend base64 key.
         *  a_key_string : custom key string.
         * @example
         *  var myCompressionObject = Global.f(skey),
         *      myCompressedString = myCompressionObject.toBase64(mySourceString),
         *      myDecompressedString = myCompressionObject.fromB128(myCompressedBase128String);
         * Method available:
         *  a: toBase64   : compress data to base 64
         *  b: fromBase64 : decompress data from base 64 string
         *  c: toB128     : compress data to base 128 string
         *  d: fromB128   : decompress data from base 128 string
         *  e: toUTF16    : if want to save data to browser storage use this one
         *  f: fromUTF16  : pair of toUTF16
         *  g: compress   : generic compress method for binary result
         *  h: decompress : generic decompress method from binary source
         */
        f: _LZString,

        /**
         * generate new UUID
         * @param {boolean} formated whether to format result
         * @returns UUID in hexadecimal form
         */
        g: function(formated) {
            var format = formated? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' : 'xxxxxxxxyxxx4xxxyxxxyxxxxxxxxxxx';
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now(); //use high-precision timer if available
            }
            return format.replace(/[xy]/g, function(c) {
                var r = (Math.random() * 17 + (d = Math.floor(d * 9 / 7))) % 16 | 0;
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        },

        /**
         * generate random string
         * @param {number} resultLength
         * @param {number} keyType 
         * @param {number} additionalVarLen
         * @returns {string} random string with length between resultLength and resultLength+additionalVarLen
         */
        h: function(resultLength, keyType, additionalVarLen){
            //var i=0, random = Math.random, round = Math.floor, result = '', key = _genKey(keyType || 1), keyLength=key.length;
            var i=0, random = Math.random, round = Math.floor, result = '', key = _genKey(keyType || 1), keyLength=getLength(key);
            for(
                resultLength += additionalVarLen? round(random()*additionalVarLen) : 0;
                i<resultLength;
                result += key[round(random()*keyLength)], i+=1
            );
            return result;
        },
        /**
         * Search from Array of objects where it has a key with certain value
         * @param {Array} obj : array of object
         * @param {String} key : key in the object
         * @param {any} value : value to search
         */
        i: function(obj, key, value){
            for(var i=0,l=obj.length; i<l; i++){
                if (obj[i][key] == value){
                    return obj[i];
                }
            }
        },
        /**
         * trim string and add ...
         * @param {string} text source string
         * @param {number} maxLength maximum length
         * @returns {string} trimmed string with addition ...
         */
        t: function(text, maxLength) {
            if (isNull(text)) return '';

            if (getLength(text) > maxLength) { //if (text.length > maxLength) {
                return text.substring(0, maxLength).concat("...");
            } else {
                return text;
            }
        },

        /* epochToJsDate : function(ts) {
            // ts = epoch timestamp
            // returns date obj
            return new Date(ts * 1000);
        },

        jsDateToEpoch : function(d) {
            // d = javascript date obj
            // returns epoch timestamp
            return (d.getTime() - d.getMilliseconds()) / 1000;
        } */
    };
});
/*

 End ./../www/app/../shr/global.js 

*/


/*

 Start ./../www/app/../shr/api.js 

*/
/*
mod : Rest: xhr way of getting resources
cre : lwx 20180428
upd : lwx 20201210
ver : 1.1
*/

appFactory(_API, [
_$http, _CONFIG, _Global, //'$q',
/**
 * API service
 * @default
 * expose: {
 *  x: xhr generic method (q:string, hdr:object, data:String|object, method="GET", config:object, isAddDefaultHeader=true, isAddBaseURL=true)
 *  g: xhrGet(q:string, hdr:any) => promise
 *  p: xhrPost(q:string, object:any, hdrs:any) => promise
 *  l: xhrGetLanguageFile(q:string, langId:string) => promise
 *  b: xhrGetBinaryData(q:string) => promise
 *  t: xhrPut(q:string, object:any, hdrs:any) => promise
 *  d: xhrDelete(q:string, hdrs) => promise
 *  u: xhrPostUploadFile(q:string, file:string) => promise
 *  e: logError(err:any, status:any, mName:string) => string
 * }
 */
function($http, CONFIG, Global) {//, $q) {
    'use strict';

    var _CT = 'Content-Type',
    _APPJSON = 'application/json',
    //_APPJSON = 'application/json;charset=utf-8',
    //_XTOKEN = 'XA'; //used to be X-Token
    //_TOKEN = 'token';
    serviceBase = CONFIG.res,
    _tokenValue = CONST_NULL,
    _add2Object = 
    /**
     * add additional key value to object
     * @param {string} key 
     * @param {*} value 
     * @param {object} obj 
     */
    function(key, value, obj){
        if (angularIsUndefined(obj)) obj = {};
        obj[key] = value;
        return obj;
    },
    _headerAsConfig = 
    /**
     * create config or header object
     * @param {object} hdrs header object
     * @param {boolean} onlyHeader
     */
    function(hdrs, onlyHeader){
        if (angularIsUndefined(hdrs)) hdrs = {};
        //if (_tokenValue = Global.a(_XTOKEN)) hdrs[_XTOKEN] = _tokenValue;
        if (_tokenValue){
            hdrs[_XTOKEN] = _tokenValue;
        } else if(_tokenValue = Global.a(_XTOKEN)){
            hdrs[_XTOKEN] = _tokenValue;
        }
        if (onlyHeader){
            return hdrs;
        } else {
            return {headers: hdrs}; //return as config
        }
    },

    _obj = {
        /**
         * $http()
         * @param {string} q requested resources
         * @param {object} hdrs header object
         * @param {any} data data object
         * @param {string} method request method: GET, POST, PUT, etc
         * @param {object} config other $http config
         * @param {boolean} isAddDefaultHeader whether to add default header
         * @param {boolean} isAddBaseURL whether to add default base url
         */
        x: function(q, hdrs, data, method, config, isAddDefaultHeader, isAddBaseURL) {
            //hdrs = _checkHeader(hdrs);
            //console.log(serviceBase + q,hdrs);
            method = method || "GET"
            if (isAddBaseURL){
                q = serviceBase + q;
            }
            if (isAddDefaultHeader){
                hdrs = _headerAsConfig(hdrs, true);
            }
            //config = config || {};
            config = _add2Object("method", method, config);
            config["url"] = q;
            if (data){
                config["data"] = data;
            }
            if (hdrs){
                config["headers"] = hdrs;
            }
            return $http(config);
        },

        /**
         * xhr get
         * @param {string} q requested resources
         * @param {object} hdrs header object
         */
        g: function(q, hdrs) {
            //hdrs = _checkHeader(hdrs);
            //console.log(serviceBase + q,hdrs);
            return $http.get(serviceBase + q, _headerAsConfig(hdrs));
        },

        /**
         * xhr post
         * @param {string} q requested resources
         * @param {any} data request body
         * @param {object} hdrs header object
         */
        p: function(q, data, hdrs) {
            //hdrs = _checkHeader(hdrs);
            //hdrs[_CT] = _APPJSON;
            //hdrs = _add2Object(_CT, _APPJSON, hdrs);
            /* return $http({
                method: 'POST',
                url: serviceBase + q,
                headers: hdrs,
                data: data
            }); */
            return $http.post(serviceBase + q, data, _headerAsConfig(_add2Object(_CT, _APPJSON, hdrs)));
        },

        /**
         * load language file
         * @param {string} q requested resources
         * @param {string} langId language file to load
         */
        l: function(q, langId) {
            //console.log(CONFIG.lDir + langId + '/' + q + '.json');
            return $http.get(CONFIG.lDir + langId + '/' + q + '.json', _headerAsConfig());
        },

        /**
         * load a file
         * @param {string} q file path
         */
        f: function(q) {
            //console.log(q);
            return $http.get(q, _headerAsConfig());
        },

        /**
         * get binary data
         * @param {string} q requested resources
         */
        b: function(q) {
            /* return $http.get(serviceBase + q, {
                responseType: 'arraybuffer',
                headers: _headerAsConfig(CONST_NULL, CONST_TRUE)
            }); */
            return $http.get(serviceBase + q, _add2Object("responseType", "arraybuffer", _headerAsConfig()));
        },
        /**
         * xhr put
         * @param {string} q requested resources
         * @param {any} data request body
         * @param {object} hdrs header object
         */
        t: function(q, data, hdrs) {
            //hdrs = _checkHeader(hdrs);
            //hdrs[_CT] = _APPJSON;
            /* return $http({
                method: 'PUT',
                url: serviceBase + q,
                headers: hdrs,
                data: data
            }); */
            return $http.put(serviceBase + q, data, _headerAsConfig(_add2Object(_CT, _APPJSON, hdrs)));
        },

        /**
         * xhr delete
         * @param {string} q requested resources
         * @param {object} hdrs header object
         */
        d: function(q, hdrs) {
            //hdrs = _checkHeader(hdrs);
            return $http.delete(serviceBase + q, _headerAsConfig(hdrs));
        },

        /**
         * upload file using xhr post
         * @param {string} q requested resources
         * @param {string} file file path
         */
        u: function(q, file) {
            var fd = new FormData();
            fd.append('file', file);

            /* return $http.post(serviceBase + q, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }); */
            return $http.post(serviceBase + q, fd, _add2Object("transformRequest", angular.identity, _headerAsConfig()));
        },

        /**
         * handle error and log to console
         * @param {any} err error
         * @param {any} status status
         * @param {string} mName module name
         * @returns {string} error string
         */
        e: function(err, status, mName) {
            var 
            e = {
                'message': err
            };
            if (status) { 
                e.status = status;
            }
            if (mName){
                e.module = mName;
            }
            console.log('error:', e);
            //save last error to the API object as err
            _obj.err = e;
            return e.toString();
        }
    }
    ; //end of var

    return _obj;
}]);
/*

 End ./../www/app/../shr/api.js 

*/


/*

 Start ./../www/app/../shr/lazy.js 

*/
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
/*

 End ./../www/app/../shr/lazy.js 

*/


/*

 Start ./../www/app/../shr/multiselectdropdown.js 

*/
appDirective('ngDropdownMultiselect', ['$filter', '$document', '$compile', '$parse',
function ($filter, $document, $compile, $parse) {

    return {
        restrict: 'AE',
        scope: {
            selectedModel: '=',
            options: '=',
            extraSettings: '=',
            events: '=',
            searchFilter: '=?',
            translationTexts: '=',
            groupBy: '@'
        },
        template: function (element, attrs) {
            var checkboxes = attrs.checkboxes ? true : false;
            var groups = attrs.groupBy ? true : false;

            var template = '<div class="multiselect-parent btn-group dropdown-multiselect">';
            template += '<button type="button" class="dropdown-toggle" ng-class="settings.buttonClasses" ng-click="toggleDropdown()">{{getButtonText()}}&nbsp;<span class="caret"></span></button>';
            template += '<ul class="dropdown-menu dropdown-menu-form" ng-style="{display: open ? \'block\' : \'none\', height : settings.scrollable ? settings.scrollableHeight : \'auto\' }" style="overflow: scroll" >';
            template += '<li ng-hide="!settings.showCheckAll || settings.selectionLimit > 0"><a data-ng-click="selectAll()"><span class="glyphicon glyphicon-ok"></span>  {{texts.checkAll}}</a>';
            template += '<li ng-show="settings.showUncheckAll"><a data-ng-click="deselectAll();"><span class="glyphicon glyphicon-remove"></span>   {{texts.uncheckAll}}</a></li>';
            template += '<li ng-hide="(!settings.showCheckAll || settings.selectionLimit > 0) && !settings.showUncheckAll" class="divider"></li>';
            template += '<li ng-show="settings.enableSearch"><div class="dropdown-header"><input type="text" class="form-control" style="width: 100%;" ng-model="searchFilter" placeholder="{{texts.searchPlaceholder}}" /></li>';
            template += '<li ng-show="settings.enableSearch" class="divider"></li>';

            if (groups) {
                template += '<li ng-repeat-start="option in orderedItems | filter: searchFilter" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupTitle(getPropertyForObject(option, settings.groupBy)) }}</li>';
                template += '<li ng-repeat-end role="presentation">';
            } else {
                template += '<li role="presentation" ng-repeat="option in options | filter: searchFilter">';
            }

            template += '<a role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))">';

            if (checkboxes) {
                template += '<div class="checkbox"><label><input class="checkboxInput" type="checkbox" ng-click="checkboxClick($event, getPropertyForObject(option,settings.idProp))" ng-checked="isChecked(getPropertyForObject(option,settings.idProp))" /> {{getPropertyForObject(option, settings.displayProp)}}</label></div></a>';
            } else {
                template += '<span data-ng-class="{\'glyphicon glyphicon-ok\': isChecked(getPropertyForObject(option,settings.idProp))}"></span> {{getPropertyForObject(option, settings.displayProp)}}</a>';
            }

            template += '</li>';

            template += '<li class="divider" ng-show="settings.selectionLimit > 1"></li>';
            template += '<li role="presentation" ng-show="settings.selectionLimit > 1"><a role="menuitem">{{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></li>';

            template += '</ul>';
            template += '</div>';

            element.html(template);
        },
        link: function ($scope, $element, $attrs) {
            var $dropdownTrigger = $element.children()[0];

            $scope.toggleDropdown = function () {
                $scope.open = !$scope.open;
            };

            $scope.checkboxClick = function ($event, id) {
                $scope.setSelectedItem(id);
                $event.stopImmediatePropagation();
            };

            $scope.externalEvents = {
                onItemSelect: angular.noop,
                onItemDeselect: angular.noop,
                onSelectAll: angular.noop,
                onDeselectAll: angular.noop,
                onInitDone: angular.noop,
                onMaxSelectionReached: angular.noop
            };

            $scope.settings = {
                dynamicTitle: true,
                scrollable: false,
                scrollableHeight: '300px',
                closeOnBlur: true,
                displayProp: 'label',
                idProp: 'id',
                externalIdProp: 'id',
                enableSearch: false,
                selectionLimit: 0,
                showCheckAll: true,
                showUncheckAll: true,
                closeOnSelect: false,
                buttonClasses: 'btn btn-default',
                closeOnDeselect: false,
                groupBy: $attrs.groupBy || undefined,
                groupByTextProvider: null,
                smartButtonMaxItems: 0,
                smartButtonTextConverter: angular.noop
            };

            $scope.texts = {
                checkAll: 'Check All',
                uncheckAll: 'Uncheck All',
                selectionCount: 'checked',
                selectionOf: '/',
                searchPlaceholder: 'Search...',
                buttonDefaultText: 'Select',
                dynamicButtonTextSuffix: 'checked'
            };

            $scope.searchFilter = $scope.searchFilter || '';

            if (angular.isDefined($scope.settings.groupBy)) {
                $scope.$watch('options', function (newValue) {
                    if (angular.isDefined(newValue)) {
                        $scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
                    }
                });
            }

            angular.extend($scope.settings, $scope.extraSettings || []);
            angular.extend($scope.externalEvents, $scope.events || []);
            angular.extend($scope.texts, $scope.translationTexts);

            $scope.singleSelection = $scope.settings.selectionLimit === 1;

            function getFindObj(id) {
                var findObj = {};

                if ($scope.settings.externalIdProp === '') {
                    findObj[$scope.settings.idProp] = id;
                } else {
                    findObj[$scope.settings.externalIdProp] = id;
                }

                return findObj;
            }

            function clearObject(object) {
                for (var prop in object) {
                    delete object[prop];
                }
            }

            if ($scope.singleSelection) {
                if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0) {
                    clearObject($scope.selectedModel);
                }
            }

            if ($scope.settings.closeOnBlur) {
                $document.on('click', function (e) {
                    var target = e.target.parentElement;
                    var parentFound = false;

                    while (angular.isDefined(target) && target !== null && !parentFound) {
                        if (_.contains(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                            if (target === $dropdownTrigger) {
                                parentFound = true;
                            }
                        }
                        target = target.parentElement;
                    }

                    if (!parentFound) {
                        $scope.$apply(function () {
                            $scope.open = false;
                        });
                    }
                });
            }

            $scope.getGroupTitle = function (groupValue) {
                if ($scope.settings.groupByTextProvider !== null) {
                    return $scope.settings.groupByTextProvider(groupValue);
                }

                return groupValue;
            };

            $scope.getButtonText = function () {
                if ($scope.settings.dynamicTitle && ($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) && _.keys($scope.selectedModel).length > 0))) {
                    if ($scope.settings.smartButtonMaxItems > 0) {
                        var itemsText = [];

                        angular.forEach($scope.options, function (optionItem) {
                            if ($scope.isChecked($scope.getPropertyForObject(optionItem, $scope.settings.idProp))) {
                                var displayText = $scope.getPropertyForObject(optionItem, $scope.settings.displayProp);
                                var converterResponse = $scope.settings.smartButtonTextConverter(displayText, optionItem);

                                itemsText.push(converterResponse ? converterResponse : displayText);
                            }
                        });

                        if ($scope.selectedModel.length > $scope.settings.smartButtonMaxItems) {
                            itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
                            itemsText.push('...');
                        }

                        return itemsText.join(', ');
                    } else {
                        var totalSelected;

                        if ($scope.singleSelection) {
                            totalSelected = ($scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
                        } else {
                            totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;
                        }

                        if (totalSelected === 0) {
                            return $scope.texts.buttonDefaultText;
                        } else {
                            return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix;
                        }
                    }
                } else {
                    return $scope.texts.buttonDefaultText;
                }
            };

            $scope.getPropertyForObject = function (object, property) {
                if (angular.isDefined(object) && object.hasOwnProperty(property)) {
                    return object[property];
                }

                return '';
            };

            $scope.selectAll = function () {
                $scope.deselectAll(false);
                $scope.externalEvents.onSelectAll();

                angular.forEach($scope.options, function (value) {
                    $scope.setSelectedItem(value[$scope.settings.idProp], true);
                });
            };

            $scope.deselectAll = function (sendEvent) {
                sendEvent = sendEvent || true;

                if (sendEvent) {
                    $scope.externalEvents.onDeselectAll();
                }

                if ($scope.singleSelection) {
                    clearObject($scope.selectedModel);
                } else {
                    $scope.selectedModel.splice(0, $scope.selectedModel.length);
                }
            };

            $scope.setSelectedItem = function (id, dontRemove) {
                var findObj = getFindObj(id);
                var finalObj = null;

                if ($scope.settings.externalIdProp === '') {
                    finalObj = _.find($scope.options, findObj);
                } else {
                    finalObj = findObj;
                }

                if ($scope.singleSelection) {
                    clearObject($scope.selectedModel);
                    angular.extend($scope.selectedModel, finalObj);
                    $scope.externalEvents.onItemSelect(finalObj);
                    if ($scope.settings.closeOnSelect) $scope.open = false;

                    return;
                }

                dontRemove = dontRemove || false;

                var exists = _.findIndex($scope.selectedModel, findObj) !== -1;

                if (!dontRemove && exists) {
                    $scope.selectedModel.splice(_.findIndex($scope.selectedModel, findObj), 1);
                    $scope.externalEvents.onItemDeselect(findObj);
                } else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
                    $scope.selectedModel.push(finalObj);
                    $scope.externalEvents.onItemSelect(finalObj);
                }
                if ($scope.settings.closeOnSelect) $scope.open = false;
            };

            $scope.isChecked = function (id) {
                if ($scope.singleSelection) {
                    return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp]) && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
                }

                return _.findIndex($scope.selectedModel, getFindObj(id)) !== -1;
            };

            $scope.externalEvents.onInitDone();
        }
    };
}

]);
/*

 End ./../www/app/../shr/multiselectdropdown.js 

*/


/*

 Start ./../www/app/../shr/ws.js 

*/
/*
mod : Web Socket
cre : lwx 20190813
upd : lwx 20190813
ver : 1.0
Ussage sample on controller:
    var onMessage = function(event){
            console.log("onmessage: ", event.data);
            $scope.msg += event.data;
            $scope.$apply(); //tell angular that scope variable has change and it should aplly the changes
        },
        logSocketEvent = function(event){
            console.log(event);
        };
    ws.init("testws", onMessage, logSocketEvent, logSocketEvent);
*/

appFactory(_WebSocket, [_Global, _CONFIG,
/**
 * Websocket service
 * @default
 * {
 *  c: connect(path, onMessage, onClose, onError) //connect to websocket
 *  s: send(data) //send data to websocket
 *  t: state() //check websocket state
 *  e: end() //disconnect
 * }
 */
function(Global, CONFIG) {
    'use strict';
    var
    stack = [],
    //onmessageDefer,
    ws;
    return {
        /**
         * web socket callback function
         * @callback websocketCallBack
         * @param {*} event event object
         */
        /**
         * Connect to websocket service
         * @param {string} path websocket service path
         * @param {websocketCallBack} onMessage onmessage callback
         * @param {websocketCallBack} onClose onclose callback
         * @param {websocketCallBack} onError onerror callback
         */
        c: function(path, onMessage, onClose, onError){
            var xtoken = Global.e(Global.a(_XTOKEN), 1)
            ws = new WebSocket(CONFIG.ws+path+"/"+xtoken);
            ws.onmessage = onMessage;
            if (angularIsFunction(onClose)){
                ws.onclose = onClose;
            }
            if (angularIsFunction(onError)){
                ws.onerror = onError;
            }
            ws.onopen = function(event) {
                /* if (onmessageDefer) {
                    ws.onmessage = onmessageDefer;
                    onmessageDefer = null;
                } */
                for (i in stack) {
                    ws.send(stack[i]);
                }
                stack = [];
            };
        },
        /**
         * Send data to websocket service
         * @param {string} data 
         */
        s: function(data) {
            //data = JSON.stringify(data);
            if (ws.readyState == 1) {
                ws.send(data);
            } else {
                stack.push(data);
            }
        },
        /**
         * @returns websocket state
         */
        t: function(){
            return ws?ws.readyState:0;
        },
        /**
         * Closing web socket connection
         */
        e: function(){
            ws.close();
        }
        /* onmessage: function(callback) {
            if (ws.readyState == 1) {
                ws.onmessage = callback;
            } else {
                onmessageDefer = callback;
            }
        } */
    };
}]);
/*

 End ./../www/app/../shr/ws.js 

*/


/*

 Start ./../www/app/index.js 

*/
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
/*

 End ./../www/app/index.js 

*/

})(window, angular);
