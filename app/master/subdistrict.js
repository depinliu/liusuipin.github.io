/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cSubdistrict', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Subdistrict","cog");
    $scope.title = "Subdistrict"
    $rootScope.activePath = $location.path();

    

}]);