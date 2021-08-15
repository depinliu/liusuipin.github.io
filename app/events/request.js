/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cEventRequest', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Ajukan Kegiatan","cog");
    $scope.title = "Ajukan Kegiatan"
    $rootScope.activePath = $location.path();

    

}]);