/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cDonors', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Donors Page","cog");
    $scope.title = "Donors Page"
    $rootScope.activePath = $location.path();

    

}]);