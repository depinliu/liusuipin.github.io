/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cEvents', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Events Page","cog");
    $scope.title = "Events Page"
    $rootScope.activePath = $location.path();

    

}]);