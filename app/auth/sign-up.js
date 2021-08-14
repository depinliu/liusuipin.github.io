/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cSignUp', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Sign Up","cog");
    $scope.title = "Sign Up"
    $rootScope.activePath = $location.path();



}]);