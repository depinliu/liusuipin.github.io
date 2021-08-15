/*
mod : User controller
cre : lwx 20180428
upd : lwx 20180521
ver : 0.2
*/

appController('cAgency', [
    '$scope', '$rootScope', '$location', '$window',
function($scope, $rootScope, $location, $window) {
    $scope.setTitle("Instansi","cog");
    $scope.title = "Instansi"
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
    $scope.agency = [{
        type: "Perusahaan",
        name: "PT. Inti Bangun Sejahtera, Tbk",
        username: "ibst",
        email: "ibstower@gmail.com",
        lastEvent: new Date("2021-08-12"),
        province: "DKI Jakarta",
        district: "Jakarta Pusat",
        subdistrict: "Menteng",
        isActive: true,
        history: [
            {
                by: "PT Inti Bangun Sejahtera, Tbk",
                date: new Date("2021-08-12"),
                location: "Gedung IBS Riau",
                heat: "105 bmp",
                glucose: "105 bmp",
                bloodPreassure: "105 mmHg",
                bloodOxygen: "97%",
                hemoglobin: "12 g/dL",
                weight: "100 kg",
                donate: "1 L"
            },
            {
                by: "KMHB UNJ",
                date: new Date("2021-08-12"),
                location: "Pura Aditya Jaya",
                heat: "105 bmp",
                glucose: "105 bmp",
                bloodPreassure: "105 mmHg",
                bloodOxygen: "97%",
                hemoglobin: "12 g/dL",
                weight: "100 kg",
                donate: "1 L"
            }
        ]
        },
    ]

    let modalAddAgency = new bootstrap.Modal(document.getElementById("modalAddAgency"), { backdrop: 'static' });
    $scope.showModalAddAccount = function (type, data) {
        console.log(type, data);
        $scope.modalType = type
        $scope.modalData = data
        modalAddAgency.show();
    }

    let modalDetailUser = new bootstrap.Modal(document.getElementById("modalDetailUser"), { backdrop: 'static' });
    $scope.showDetailUser = function (type, data) {
        console.log(type, data);
        $scope.modalType = type
        $scope.modalData = data
        modalDetailUser.show();
    }

    let deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"), { backdrop: 'static' });
    $scope.showDeleteModal = function (x) {
        $scope.btnDelete = "Yakin"
        $scope.delete = x
        deleteModal.show();
    }

}]);