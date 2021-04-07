angular.module('aopApp').controller('cUserManagement', ['$scope', '$http', '$route', '$location',
    function($scope, $http, $route, $location) {
        let urlBase = "https://localhost:44391/api";
        $scope.userData = JSON.parse(localStorage.getItem("aopUserData"))
        

    }
]);


