/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cAgency', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Agency Page","cog");
    $scope.title = "Agency Page"
    $rootScope.activePath = $location.path();

    

}]);