angular.module('aopApp').controller('cExpenseBa', ['$scope', '$http', '$route', '$location',
    function($scope, $http, $route, $location) {
        let urlBase = "https://localhost:44391/api";
        $scope.userData = JSON.parse(localStorage.getItem("aopUserData"))

        if($scope.userData.role === 2 || $scope.userData.role === 3){
            $scope.submissionTypeTitle = "New Submission"

            $scope.baListToggle = function(){
                getBa()
            }

            const getBa = async () => {
                const userData = JSON.parse(localStorage.getItem("aopUserData"))
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/business-area`,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(response) {
                    $scope.baData = response.data
                }, function errorCallback(response) {
                    console.log(response);
                })
            }
            getBa()

            $scope.submissionBtnTitle = "Submit"
            $scope.years = [
                {value: 2019},
                {value: 2020},
                {value: 2021},
            ]
            
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
                {month: "October", value: 10},
                {month: "November", value: 11},
                {month: "December", value: 12}
            ]
            $scope.selectedYear = new Date().getFullYear();
            $scope.selectedMonth = new Date().getMonth()+1;
            if($scope.userData.role === 2){
                $scope.selectedBaName = "-- Choose Businees Area --";
            }else{
                $scope.selectedBa = $scope.userData.baCode
            }
            // $scope.selectedBa = $scope.userData.baCode
            
            $scope.filterExpense = function(){
                getBaExpenseYear()
                getBaExpense()
                getExpensetype()
                getAopDataExpenseType()
                getBaExpenseTotal()
            }
            $scope.selectBa = function(data){
                $scope.selectedBaName = data.estateName
                $scope.selectedBa = data.bacode
                $scope.showBaList = false
                getBaExpenseYear()
                getBaExpense()
                getAopData()
                getExpensetype()
                getAopDataExpenseType()
                getBaExpenseTotal()
            }
            $scope.isLoading = true;
            const getBaExpense = () => {
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/expense/ba/${$scope.selectedBa}/${$scope.selectedYear}/${$scope.selectedMonth}`,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(response) {
                    let dataExp = response.data
                    // console.log(dataExp);
                    $scope.expenses = []
                    Object.keys(dataExp).map(key => {
                        $scope.expenses.push({
                            expenseId: dataExp[key].id,
                            expenseTypeId: dataExp[key].expenseTypeId,
                            expenseTypeName: dataExp[key].expenseType.typeName,
                            entryDate: dataExp[key].entryDate,
                            documentNumber: dataExp[key].documentNumber,
                            description: dataExp[key].description,
                            quantity: dataExp[key].quantity,
                            unit: dataExp[key].unit,
                            price: dataExp[key].price,
                            total: dataExp[key].total,
                            budgeted: dataExp[key].budgeted,
                            pta: dataExp[key].pta
                        })
                    })
                    $scope.isLoading = false;
                    $scope.sumTotalMonth = function () {
                        var totalMonth = 0;
                        angular.forEach(dataExp, function (detail) {
                            totalMonth += parseFloat(detail.total == "" ? 0 : detail.total);
                        })
                        return totalMonth;
                    }
                    $scope.sumTotalBudgeted = function () {
                        var totalBudgeted = 0;
                        angular.forEach(dataExp, function (detail) {
                            totalBudgeted += parseFloat(detail.budgeted == "" ? 0 : detail.budgeted);
                        })
                        return totalBudgeted;
                    }
                    $scope.sumTotalPta = function () {
                        var totalPta = 0;
                        angular.forEach(dataExp, function (detail) {
                            totalPta += parseFloat(detail.pta == "" ? 0 : detail.pta);
                        })
                        return totalPta;
                    }
                    $scope.sumTotalExpenseType = function (typeId) {
                        var total = 0;
                        angular.forEach(dataExp, function (detail) {
                            if (detail.expenseTypeId == typeId) {
                                total += parseFloat(detail.total == "" ? 0 : detail.total);
                            }
                        })
                        return total;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                    $scope.isLoading = false;
                })
            }
            getBaExpense();

            const getBaExpenseYear = () => {
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/expense/ba/${$scope.selectedBa}/${$scope.selectedYear}`,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(response) {
                    let dataExp = response.data
                    console.log(dataExp);
                    $scope.sumTotalYearExpense = function(){
                        $scope.expenseYear = 0;
                        angular.forEach(dataExp, function (detail) {
                            $scope.expenseYear += parseFloat(detail.total == "" ? 0 : detail.total);
                        })
                        return $scope.expenseYear;
                    }
                    
                    $scope.isLoading = false;
                }, function errorCallback(response) {
                    console.log(response);
                    $scope.isLoading = false;
                })
            }
            getBaExpenseYear();

            const getExpensetype = () => {
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
            }
            getExpensetype()

            const getAopData = () => {
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/ba/${$scope.selectedBa}/${$scope.selectedYear}`,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(response) {
                    let dataAop = response.data
                    $scope.aopData = response.data
                    // console.log(dataAop);
                    $scope.sumTotalYear = function () {
                        $scope.subTotal = 0;
                        angular.forEach(dataAop, function (detail) {
                            if(detail.year === $scope.selectedYear){
                                $scope.subTotal += parseFloat(detail.aopamount == "" ? 0 : detail.aopamount);
                            }
                        })
                        return $scope.subTotal;
                    }
                    $scope.sumTotalMonthExpense = function (month) {
                        $scope.subTotalMonth = 0;
                        angular.forEach(dataAop, function (detail) {
                            if (detail.month === month && detail.year === $scope.selectedYear) {
                                $scope.subTotalMonth += parseFloat(detail.aopamount == "" ? 0 : detail.aopamount);
                            }
                        })
                        return $scope.subTotalMonth;
                    }

                    $scope.sumTotalAopAmount = function (typeId, month) {
                        $scope.subTotalAopAmount = 0;
                        angular.forEach(dataAop, function (detail) {
                            if (detail.expenseTypeId === typeId && detail.month === month) {
                                $scope.subTotalAopAmount += parseFloat(detail.aopamount == "" ? 0 : detail.aopamount);
                            }
                        })
                        // console.log(total);
                        return $scope.subTotalAopAmount;
                    }
                    $scope.sumTotalAopYear = function (month) {
                        $scope.subTotalAopYear = 0;
                        angular.forEach(dataAop, function (detail) {
                            if(detail.year === $scope.selectedYear && detail.month === month){
                                $scope.subTotalAopYear += parseFloat(detail.aopamount == "" ? 0 : detail.aopamount);
                            }
                        })
                        // console.log(total);
                        return $scope.subTotalAopYear;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                })
            }
            getAopData()

            const getAopDataExpenseType = () => {
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/ba/${$scope.selectedBa}`,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(response) {
                    let dataAop = response.data
                    $scope.sumTotalAopByExpenseTypeMonth = function (typeId, entryDate) {
                        if(entryDate !== null){
                            let month = entryDate.getMonth()+1
                            let year = entryDate.getFullYear()
                            $scope.subTotalAopExpenseType = 0;
                            angular.forEach(dataAop, function (detail) {
                                if (detail.expenseTypeId === typeId && detail.month === month && detail.year === year) {
                                    $scope.subTotalAopExpenseType += parseFloat(detail.aopamount == "" ? 0 : detail.aopamount);
                                }
                            })
                            return $scope.subTotalAopExpenseType;
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response);
                })
            }
            getAopDataExpenseType()

            const getBaExpenseTotal = () => {
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/expense/ba/${$scope.selectedBa}`,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(response) {
                    let dataExp = response.data
                    // console.log(dataExp);
                    $scope.sumTotalBaExpenseType = function(typeId, entryDatess){
                        if(entryDatess === null || entryDatess === undefined){
                            // console.log("Null wey");
                        }else{
                            // console.log(entryDatess);
                            let month = entryDatess.getMonth()+1
                            let year = entryDatess.getFullYear()
                            // console.log(month.toString(), year.toString());
                            $scope.expenseBaType = 0;
                            angular.forEach(dataExp, function (detail) {
                                var detailYear = detail.entryDate.split("-")[0]
                                var detailMonth = detail.entryDate.split("-")[1]
                                if(detail.expenseTypeId === typeId && parseInt(detailMonth) === month && parseInt(detailYear) === year){
                                    $scope.expenseBaType += parseFloat(detail.total == "" ? 0 : detail.total);
                                }
                            })
                            return $scope.expenseBaType;
                        }
                    }
                    
                    $scope.isLoading = false;
                }, function errorCallback(response) {
                    console.log(response);
                    $scope.isLoading = false;
                })
            }
            getBaExpenseTotal();
            
            $scope.expenseDataForm = {
                departmentCode: null,
                typeName: null,
                entryDate: null,
                documentNumber: null,
                description: null,
                quantity: null,
                unit: null,
                price: null,
                total: null,
                // budgeted: $scope.expenseDataForm.budgeted,
                // pta: $scope.expenseDataForm.pta,
                budgeted: null,
                pta: null
            }

            var modalNewExpense = new bootstrap.Modal(document.getElementById("modalNewExpense"), {backdrop: 'static'});
            $scope.showModalNewExpense = function(status, editData){
                modalNewExpense.show();
                getExpensetype()

                if(status === 1){
                    // $scope.expenseValue = true
                    $scope.sumbitNewExpense = function(){
                        $http({
                            method: 'POST',
                            url: `${urlBase}/aop/expenses`,
                            headers: {
                                'Authorization': 'Bearer ' + $scope.userData.accessToken
                            },
                            data: {
                                bacode: $scope.userData.baCode,
                                departmentCode: "",
                                expenseTypeId: $scope.expenseDataForm.typeName,
                                entryDate: $scope.expenseDataForm.entryDate,
                                documentNumber: $scope.expenseDataForm.documentNumber,
                                description: $scope.expenseDataForm.description,
                                quantity: $scope.expenseDataForm.quantity,
                                unit: $scope.expenseDataForm.unit,
                                price: $scope.expenseDataForm.price,
                                total: $scope.expenseDataForm.price * $scope.expenseDataForm.quantity,
                                // budgeted: $scope.expenseDataForm.budgeted,
                                // pta: $scope.expenseDataForm.pta,
                                budgeted: $scope.expenseDataForm.price * $scope.expenseDataForm.quantity,
                                pta: 0,
                                dateTimeCreated: new Date().toISOString().slice(0, 10)+" "+new Date().toLocaleTimeString(),
                                createdBy: $scope.userData.emplName,
                                dateTimeModified: new Date().toISOString().slice(0, 10)+" "+new Date().toLocaleTimeString(),
                                modifiedBy: $scope.userData.emplName,
                                isDeleted: 0,
                            }
                        }).then(function successCallback(res) {
                            getBaExpense()
                            modalNewExpense.hide();
                            $scope.successResponse("Add new Expense is successfully!")
                            $route.reload()
                        }, function errorCallback(res) {
                            errorResponse(res)
                        })
                    }

                }else{
                    console.log("edit data: ", editData);
                    $scope.submissionTypeTitle = "Edit Submission"
                    $scope.submissionBtnTitle = "Save Changes"
                    $scope.expenseDataForm.typeName = editData.expenseTypeId
                    $scope.expenseDataForm.entryDate = editData.entryDate
                    $scope.expenseDataForm.documentNumber = editData.documentNumber
                    $scope.expenseDataForm.description = editData.description
                    $scope.expenseDataForm.quantity = editData.quantity
                    $scope.expenseDataForm.unit = editData.unit
                    $scope.expenseDataForm.price = editData.price
                    $scope.expenseDataForm.total = editData.total
                    $scope.expenseDataForm.budgeted = editData.budgeted

                    $scope.sumbitNewExpense = function(){
                        $http({
                            method: 'PUT',
                            url: `${urlBase}/aop/expense/${$scope.userData.baCode}`,
                            headers: {
                                'Authorization': 'Bearer ' + $scope.userData.accessToken
                            },
                            data: {
                                bacode: $scope.userData.baCode,
                                departmentCode: "",
                                expenseTypeId: $scope.expenseDataForm.typeName,
                                entryDate: $scope.expenseDataForm.entryDate,
                                documentNumber: $scope.expenseDataForm.documentNumber,
                                description: $scope.expenseDataForm.description,
                                quantity: $scope.expenseDataForm.quantity,
                                unit: $scope.expenseDataForm.unit,
                                price: $scope.expenseDataForm.price,
                                total: $scope.expenseDataForm.price * $scope.expenseDataForm.quantity,
                                // budgeted: $scope.expenseDataForm.budgeted,
                                // pta: $scope.expenseDataForm.pta,
                                budgeted: $scope.expenseDataForm.price * $scope.expenseDataForm.quantity,
                                pta: 0,
                                dateTimeCreated: new Date().toISOString().slice(0, 10)+" "+new Date().toLocaleTimeString(),
                                createdBy: $scope.userData.emplName,
                                dateTimeModified: new Date().toISOString().slice(0, 10)+" "+new Date().toLocaleTimeString(),
                                modifiedBy: $scope.userData.emplName,
                                isDeleted: 0,
                            }
                        }).then(function successCallback(res) {
                            getBaExpense()
                            modalNewExpense.hide();
                            $scope.expenseDataForm.documentNumber = null
                            $scope.expenseDataForm.description = null
                            $scope.expenseDataForm.quantity = null
                            $scope.expenseDataForm.unit = null
                            $scope.expenseDataForm.price = null
                            $scope.successResponse("Update Expense is successfully!")
                        }, function errorCallback(res) {
                            errorResponse(res)
                        })
                    }
                }

            }

            $scope.askToDelete = function(data){
                Swal.fire({
                    title: 'Are you sure?',
                    text: `You won't be able to revert expense with document number: ${data.documentNumber}!`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $http({
                            method: 'DELETE',
                            url: `${urlBase}/aop/expense/${data.expenseId}`,
                            headers: {
                                'Authorization': 'Bearer ' + $scope.userData.accessToken
                            }
                        }).then(function successCallback(res) {
                            $scope.successResponse(`Expense with document number ${data.documentNumber} has been deleted!`)
                            getBaExpense()
                        }, function errorCallback(res) {
                            // errorResponse("Department")
                            console.log(res);
                        })
                    }
                })
            }
        }else{
            $location.path("/access-denied");
        }

    }
]);


