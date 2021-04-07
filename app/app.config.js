angular.module('aopApp').config([ "$ocLazyLoadProvider", function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // cache: false,
        'debug': false, // For debugging 'true/false'
        'events': true, // For Event 'true/false'
        'modules': [{ // Set modules initially
            name : 'cHome', // State1 module
            files: ['app/components/home/home.js']
        },{ // Set modules initially
            name : 'cExpenseBa', // State1 module
            files: ['app/components/expense/expense-ba.js']
        },{
            name : 'cExpenseDepartment', 
            files: ['app/components/expense/expense-department.js']
        }
        ,{
            name : 'cAopBa', 
            files: ['app/components/aop/aop-ba.js']
        }
        ,{
            name : 'cAopDepartment', 
            files: ['app/components/aop/aop-department.js']
        }
        ,{
            name : 'cUserManagement', 
            files: ['app/components/user-management/user-management.js']
        }
        ,{
            name : 'cRoles', 
            files: ['app/components/roles/roles.js']
        }
    ]});
}]);