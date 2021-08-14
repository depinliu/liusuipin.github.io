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