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