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