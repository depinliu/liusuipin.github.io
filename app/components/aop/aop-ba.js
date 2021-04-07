angular.module('aopApp').controller("cAopBa", ['$scope', '$http', '$location', function ($scope, $http, $location) {
    let urlBase = "https://localhost:44391/api";
    $scope.userData = JSON.parse(localStorage.getItem("aopUserData"))

    console.log($scope.userData);

    if($scope.userData.role !== 2){
        $location.path("/access-denied");
    }else{
            $scope.months = [
                {month: "January", value: 1},
                {month: "February", value: 2},
                {month: "March", value: 3},
                {month: "April", value: 4},
                {month: "May", value: 5},
                {month: "June", value: 6},
                {month: "July", value: 7},
                {month: "August", value: 8},
                {month: "September", value: 9},
                {month: "October",value: 10},
                {month: "November", value: 11},
                {month: "December", value: 12 }
            ]
        
            $scope.theadData = ["AOP", "Pengajuan", "Sisa" ]
            $scope.isAop = false;
            $scope.years = [
                {value: 2019},
                {value: 2020},
                {value: 2021},
            ]
            $scope.selectedYear = new Date().getFullYear();
        
            $scope.filterAop = function(){
                getAopData()
                getBaExpense()
            }
            $scope.showBaList = false
            $scope.baListToggle = function(){
                // $scope.showBaList = !$scope.showBaList
                getBaMaster()
            }
            $scope.selectedBa = "-- Choose Businees Area --";
        
            $scope.selectBa = function(data){
                $scope.selectedBa = data.estateName
                $scope.selectedBaCode = data.bacode
                $scope.showBaList = false
                getAopData()
                getBaExpense()
                $scope.isAop = true;
            }
        
            const getBaMaster = () => {
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/business-area`,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(response) {
                    $scope.baMasterData = response.data
                }, function errorCallback(response) {
                    console.log(response);
                })
            }
        
            const getAopData = () => {
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/ba/${$scope.selectedBaCode}/${$scope.selectedYear}`,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(response) {
                    let dataAop = response.data
                    $scope.aopData = response.data
                    console.log(dataAop);
                    $scope.sumTotalAop = function (typeId) {
                        $scope.subTotal = 0;
                        angular.forEach(dataAop, function (detail) {
                            if (detail.expenseTypeId == typeId) {
                                $scope.subTotal += parseFloat(detail.aopamount == "" ? 0 : detail.aopamount);
                            }
                        })
                        // console.log(total);
                        return $scope.subTotal;
                    }
                    $scope.sumTotalAopAmount = function (typeId, month) {
                        $scope.subTotal = 0;
                        angular.forEach(dataAop, function (detail) {
                            if (detail.expenseTypeId === typeId && detail.month === month) {
                                $scope.subTotal += parseFloat(detail.aopamount == "" ? 0 : detail.aopamount);
                            }
                        })
                        // console.log(total);
                        return $scope.subTotal;
                    }
                    $scope.sumTotalAopYear = function () {
                        $scope.subTotal = 0;
                        angular.forEach(dataAop, function (detail) {
                            if(detail.year === $scope.selectedYear){
                                $scope.subTotal += parseFloat(detail.aopamount == "" ? 0 : detail.aopamount);
                            }
                        })
                        // console.log(total);
                        return $scope.subTotal;
                    }
                    $scope.sumTotalAopMonth = function (selectedMonth) {
                        $scope.subTotal = 0;
                        angular.forEach(dataAop, function (detail) {
                            if(detail.year === $scope.selectedYear && detail.month === selectedMonth){
                                $scope.subTotal += parseFloat(detail.aopamount == "" ? 0 : detail.aopamount);
                            }
                        })
                        // console.log(total);
                        return $scope.subTotal;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                })
            }
            getAopData()
            
            const getBaExpense = async() => {
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/expense/ba/${$scope.selectedBaCode}/${$scope.selectedYear}`,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(response) {
                    let dataExp = response.data
                    // console.log("DATA EXPENSE: ", dataExp);
                    $scope.sumTotalExpenseType = function (typeId, selectedMonth) {
                        $scope.totalCost = 0;
                        angular.forEach(dataExp, function (detail) {
                            var year = detail.entryDate.split("-")[0]
                            var month = detail.entryDate.split("-")[1]
                            if (detail.expenseTypeId == typeId && year == $scope.selectedYear && month == selectedMonth) {
                                $scope.totalCost += parseFloat(detail.total == "" ? 0 : detail.total);
                            }
                        })
                        return $scope.totalCost;
                    }
                    $scope.sumTotalExpenseYear = function () {
                        $scope.totalYear1 = 0;
                        angular.forEach(dataExp, function (detail) {
                            var year = detail.entryDate.split("-")[0]
                            if(year == $scope.selectedYear){
                                $scope.totalYear1 += parseFloat(detail.total == "" ? 0 : detail.total);
                            }
                        })
                        // console.log(total);
                        return $scope.totalYear1;
                    }
                    $scope.sumTotalExpenseMonth = function (selectedMonth) {
                        $scope.totalYear1 = 0;
                        angular.forEach(dataExp, function (detail) {
                            var year = detail.entryDate.split("-")[0]
                            var month = detail.entryDate.split("-")[1]
                            if(year == $scope.selectedYear && month == selectedMonth){
                                $scope.totalYear1 += parseFloat(detail.total == "" ? 0 : detail.total);
                            }
                        })
                        // console.log(total);
                        return $scope.totalYear1;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                })
            }
            getBaExpense()
        
            var modalNewExpense = new bootstrap.Modal(document.getElementById("modalExpenseDetail"),{});
            $scope.getExpenseDetail = function(data, month){
                modalNewExpense.show();
                $scope.selectedExpenseType = data.typeName
                $scope.selectedMonth = month;
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/expense/ba/${$scope.selectedBaCode}/${$scope.selectedYear}/${$scope.selectedMonth}/${data.id}`,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(res) {
                    // console.log("expense detail go: ", res.data);
                    $scope.baExpenseDetail = res.data
                    $scope.sumTotalMonth = function () {
                        var totalMonth = 0;
                        angular.forEach($scope.baExpenseDetail, function (detail) {
                            totalMonth += parseFloat(detail.total == "" ? 0 : detail.total);
                        })
                        return totalMonth;
                    }
                    $scope.sumTotalBudgeted = function () {
                        var totalBudgeted = 0;
                        angular.forEach($scope.baExpenseDetail, function (detail) {
                            totalBudgeted += parseFloat(detail.budgeted == "" ? 0 : detail.budgeted);
                        })
                        return totalBudgeted;
                    }
                    $scope.sumTotalPta = function () {
                        var totalPta = 0;
                        angular.forEach($scope.baExpenseDetail, function (detail) {
                            totalPta += parseFloat(detail.pta == "" ? 0 : detail.pta);
                        })
                        return totalPta;
                    }
                }, function errorCallback(res) {
                    console.log(res);
                })
            }

            const getExpensetype = () => {
                try {
                    $http({
                        method: 'GET',  
                        url: `${urlBase}/aop/expense-types/ba`,
                        headers: {
                            'Authorization': 'Bearer ' + $scope.userData.accessToken
                        }
                    }).then(function successCallback(res) {
                        let data = res.data
                        $scope.expenseTypes = res.data
                            // console.log("ba", data);
                        
                    }, function errorCallback(res) {
                        console.log(res);
                    })
                } catch (error) {
                    console.log("isi error", error);
                }
            }
            getExpensetype()

    }



}]);

