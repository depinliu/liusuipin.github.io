/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cProvince', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Provinsi","cog");
    $scope.title = "Provinsi"
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
    $scope.provinces = [{
        name: "DKI Jakarta",
        username: "pmijakarta",
        email: "pmi-jakarta@gmail.com",
        password: "xx#9yaasu212@3ias",
        isActive: true
    },
    {
        name: "Bali",
        username: "pmibali",
        email: "pmi-bali@gmail.com",
        password: "xx#9yaasu212@3ias",
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