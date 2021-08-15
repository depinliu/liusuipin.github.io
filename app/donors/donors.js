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
        district: "Jakarta Barat",
        subdistrict: "Palmerah",
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
        ],
        totalDonate: "4L"
    },
    {
        nik: 19030103011294,
        name: "Denis",
        username: "denis",
        email: "denis@gmail.com",
        bloodType: "A+",
        lastDonor:new Date("2021-08-12"),
        province: "DKI Jakarta",
        district: "Jakarta Timur",
        subdistrict: "Matraman",
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
        ],
        totalDonate: "4L"
    }]

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