/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cDonors', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Pendonor","cog");
    $scope.title = "Pendonor"
    $rootScope.activePath = $location.path();

    $scope.orderFilter = "name";
    $scope.setOrderFilter = function (propertyName) {
        if ($scope.orderFilter === propertyName) {
            $scope.orderFilter = '-' + propertyName;
        } else if ($scope.orderFilter === '-' + propertyName) {
            $scope.orderFilter = propertyName;
        } else {
            $scope.orderFilter = propertyName;
        }
    };

    $scope.isLoad = false
    $scope.donors = [{
        nik: 19030103011290,
        name: "Devin Liu",
        username: "devinliu",
        email: "niveduil@gmail.com",
        bloodType: "O",
        lastDonor: new Date("2021-08-12"),
        province: "DKI Jakarta",
        isActive: true
    },
    {
        nik: 19030103011294,
        name: "Denis",
        username: "denis",
        email: "denis@gmail.com",
        bloodType: "A+",
        lastDonor:new Date("2021-08-12"),
        province: "Bali",
        isActive: true
    }]

    let modalAddAccount = new bootstrap.Modal(document.getElementById("modalAddAccount"), { backdrop: 'static' });
    $scope.showModalAddAccount = function (type, data) {
        console.log(type, data);
        $scope.modalType = type
        modalAddAccount.show();
    }

    let deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"), { backdrop: 'static' });
    $scope.showDeleteModal = function (x) {
        $scope.btnDelete = "Yakin"
        $scope.delete = x
        deleteModal.show();
    }

}]);