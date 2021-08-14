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