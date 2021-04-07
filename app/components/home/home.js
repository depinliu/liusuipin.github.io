angular.module('aopApp').controller('cHome', ['$scope', '$http',
    function($scope, $http) {
        $scope.title = "Home"
        let urlBase = "https://localhost:44391/api";
        // let userData = JSON.parse(localStorage.getItem("aopUserData"))
        // console.log(userData);
        // let location = userData.location.split(" ")
        // $scope.userLocation = location[0]

        // const getBaMaster = () => {
        //     $http({
        //         method: 'GET',  
        //         url: `${urlBase}/aop/business-area`,
        //         headers: {
        //             'Authorization': 'Bearer ' + userData.accessToken
        //         }
        //     }).then(function successCallback(response) {
        //         $scope.baMasterData = response.data
        //         console.log($scope.baMasterData);
        //     }, function errorCallback(response) {
        //         console.log(response);
        //     })
        // }
        // getBaMaster()
    }
]);


