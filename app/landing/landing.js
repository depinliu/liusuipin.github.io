/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cLanding', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Landing Page","cog");
    $scope.title = "Landing Page"
    $rootScope.activePath = $location.path();

    

}]);