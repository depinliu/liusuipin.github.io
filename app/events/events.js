/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cEvents', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Kegiatan Donor Darah","cog");
    $scope.title = "Kegiatan Donor Darah"
    $rootScope.activePath = $location.path();

    

}]);