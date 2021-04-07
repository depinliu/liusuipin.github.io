
angular.module('aopApp').config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            redirectTo: '/home'
        })
        .when("/access-denied", {
            templateUrl: '401.html',
        })
        .when('/home', {
            templateUrl: 'app/components/home/home.html',
            title: 'Home',
            controller: 'cHome',
            resolve: {
                LazyLoadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('cHome'); // Resolve promise and load before view 
                }]
            }
        })
        .when('/expense/ba', {
            templateUrl: 'app/components/expense/expense-ba.html',
            title: 'ExpenseBa',
            controller: 'cExpenseBa',
            resolve: {
                LazyLoadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('cExpenseBa'); 
                }]
            }
        })
        .when('/expense/department', {
            templateUrl: 'app/components/expense/expense-department.html',
            title: 'ExpenseDepartment',
            controller: 'cExpenseDepartment',
            resolve: {
                LazyLoadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('cExpenseDepartment'); 
                }]
            },
        })
        .when('/aop/ba', {
            templateUrl: 'app/components/aop/aop-ba.html',
            title: 'aopBa',
            controller: 'cAopBa',
            resolve: {
                LazyLoadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('cAopBa'); 
                }]
            },
        })
        .when('/aop/department', {
            templateUrl: 'app/components/aop/aop-department.html',
            title: 'aopDepartment',
            controller: 'cAopDepartment',
            resolve: {
                LazyLoadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('cAopDepartment'); 
                }]
            },
        })
        .when('/admin/user-management', {
            templateUrl: 'app/components/user-management/user-management.html',
            title: 'userManagement',
            controller: 'cUserManagement',
            resolve: {
                LazyLoadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('cUserManagement'); 
                }]
            },
        })
        .when('/admin/role-settings', {
            templateUrl: 'app/components/roles/roles.html',
            title: 'Roles',
            controller: 'cRoles',
            resolve: {
                LazyLoadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('cRoles'); 
                }]
            },
        })
        
    $routeProvider.otherwise({
        templateUrl: "404.html"
    });
});