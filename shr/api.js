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