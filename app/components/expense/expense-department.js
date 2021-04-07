angular.module('aopApp').controller("cExpenseDepartment", ['$scope', '$http', '$route', '$location',
    function($scope, $http, $route, $location) {
        let urlBase = "https://localhost:44391/api";
        $scope.userData = JSON.parse(localStorage.getItem("aopUserData"))

        // let aopStatusCode = localStorage.getItem("aopLogin")

        if($scope.userData.role === 2 || $scope.userData.role === 4){
            $scope.submissionTypeTitle = "New Submission"
            $scope.submissionBtnTitle = "Submit"

            const getDepartments = async () => {
                const userData = JSON.parse(localStorage.getItem("aopUserData"))
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/departments`,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(response) {
                    $scope.departmentsData = response.data
                }, function errorCallback(response) {
                    console.log(response);
                    $scope.isLoading = false;
                })
            }
            getDepartments()

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
            $scope.selectedDepartment = $scope.userData.departmentCode
            
            $scope.filterExpense = function(){
                getDepartmentExpense()
            }
            $scope.isLoading = true;
            const getDepartmentExpense = () => {
                $http({
                    method: 'GET',  
                    url: `${urlBase}/aop/expense/department/${$scope.selectedDepartment}/${$scope.selectedYear}/${$scope.selectedMonth}`,
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
            getDepartmentExpense();

            const getExpensetype = () => {
                $http.get(`${urlBase}/aop/expense-types/department`, {
                    headers: {
                        'Authorization': 'Bearer ' + $scope.userData.accessToken
                    }
                }).then(function successCallback(res) {
                    let data = res.data
                    $scope.expenseTypes = res.data
                    $scope.isLoading = false
                    
                }, function errorCallback(res) {
                    console.log(res);
                })
            }
            getExpensetype()
            
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
    
            $scope.selectDepExpType = function(x){
                $scope.expenseDataForm.typeName = x.id
                $scope.selectedDepExpType = x.typeName;
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
                                bacode: "",
                                departmentCode: "8101326000",
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
                            getDepartmentExpense()
                            modalNewExpense.hide();
                            $scope.expenseDataForm.documentNumber = null
                            $scope.expenseDataForm.description = null
                            $scope.expenseDataForm.quantity = null
                            $scope.expenseDataForm.unit = null
                            $scope.expenseDataForm.price = null
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
                            url: `${urlBase}/aop/expense/8101326000`,
                            headers: {
                                'Authorization': 'Bearer ' + $scope.userData.accessToken
                            },
                            data: {
                                bacode: "",
                                departmentCode: 8101326000,
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
                            getDepartmentExpense()
                            modalNewExpense.hide();
                            $route.reload()
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
                            getDepartmentExpense()
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











// const getExpensetype = async() => {
//     try {
//         fetch(`${urlBase}/aop/expense-types/department`,{
//             headers: { 
//                 Accept: "application/json;odata=verbose",
//                 'Authorization': 'Bearer ' + $scope.userData.accessToken
//             }
//         })
//         .then(response => response.json())
//         .then(data => $scope.expenseTypes = data)
//     } catch (error) {
//         console.log(error);
//     }
// }
// getExpensetype()