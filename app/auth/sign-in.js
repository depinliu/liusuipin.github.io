/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cSignIn', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Sign In","cog");
    $scope.title = "Sign In"
    $rootScope.activePath = $location.path();



}]);