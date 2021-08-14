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