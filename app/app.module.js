angular.element(document).ready(function () {
    angular.bootstrap(document.getElementById("aopApp"), ['aopApp']);
});
angular.module("aopApp", ['ngRoute', 'oc.lazyLoad'])    

angular.module('aopApp').controller("cAopApp", ['$scope', '$rootScope' , '$http', function ($scope, $rootScope, $http) {
    $scope.title = "Aop BA"
    var urlBase = "https://localhost:44391/api";

    const getSPUserProfile = () => {
        // console.log(_spPageContextInfo.userLoginName);
        $http({
            method: 'GET',
            // url: 'https://cors-anywhere.herokuapp.com/https://mylonsum.londonsumatra.com/_api/sp.userprofiles.peoplemanager/GetMyProperties',
            url: 'https://mylonsum.londonsumatra.com/_api/sp.userprofiles.peoplemanager/GetMyProperties',
            headers: { 
                'Accept': "application/json;odata=verbose", 
                'Access-Control-Allow-Origin': 'https://mylonsum.londonsumatra.com' 
            },
            // mode: 'cors',
            // credentials: 'include'
        }).then(function successCallback(response) {
            let res = response.data.data.d
            // console.log("Isi DATA Sharepoint = ", res);
            const token = JSON.parse(localStorage.getItem("aopUserData"))
            $scope.userData = token
            if(res){
                // let EmplCode = res.UserProfileProperties.results[94].Value
                let Email = res.Email
                let LoginUser = res.AccountName.split("\\")
                let Title = res.Title
                if(token == undefined || token === null){
                    getToken(Email, LoginUser[1], Title);
                    // let token = JSON.parse(localStorage.getItem("aopUserData"))
                    // $scope.location = token.location
                    // $scope.departmentBa = token.department
                    // setInterval(refToken, 240000);
                }else{
                    // refToken()
                    // getDepartments();
                    // console.log("Token not null");
                    $scope.location = token.location
                    $scope.departmentBa = token.department
                }
            }
        }, function errorCallback(response) {
            errorResponse("SP User")
        })
    }
    getSPUserProfile()

    // const getSp = async() => {
    //     let url = 'https://mylonsum.londonsumatra.com/_api/sp.userprofiles.peoplemanager/GetMyProperties';
    //     try {
    //         fetch(`${url}`,{
    //             headers: { Accept: "application/json;odata=verbose" }
    //         })
    //         .then(response => response.json())
    //         .then(data => 
    //             console.log(data.d)
    //         );
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    function getToken(b, c, d){
        $http({
            method: 'POST',
            url: `${urlBase}/aop/auth/get-token`,
            data: {
                Email: b,
                LoginUser: c
            }
        }).then(function successCallback(response) {
            console.log("isi login: ", response);
            localStorage.setItem("aopUserData",  JSON.stringify(response.data))
            window.location.reload()
            // getDepartments();
        }, function errorCallback(response) {
            console.log("error login: ", response);
        })
    }
    
    function refToken(){
        let token = JSON.parse(localStorage.getItem("aopAccessToken"))
        let accToken = token.aopAccessToken
        let refToken = token.aopRefreshToken
        $http({
            method: 'POST',
            url: `${urlBase}/aop/auth/refresh-token`,
            data: {
                AccessToken: accToken,
                RefreshToken: refToken
            }
        }).then(function successCallback(response) {
            // successResponse("Refresh token is successfully!")
            console.log("isi refresh token baru: ", response.data);
            localStorage.setItem("aopUserData", JSON.stringify(response.data))
        }, function errorCallback(response) {
            // if(response.status === 500){
            //     localStorage.removeItem("aopAccessToken")
            //     localStorage.removeItem("aopRefreshToken")
            //     getSPUserProfile();
            // }
            console.log(response);
        })
    }
    

    $scope.successResponse = function(res) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: res
        })
    }
}]);



