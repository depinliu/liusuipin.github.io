/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cRequestList', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Daftar Permintaan Kegiatan","cog");
    $scope.title = "Daftar Permintaan Kegiatan"
    $rootScope.activePath = $location.path();

    

}]);