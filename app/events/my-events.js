/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cMyEvents', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Kegiatan Saya","cog");
    $scope.title = "Kegiatan Saya"
    $rootScope.activePath = $location.path();

    

}]);