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