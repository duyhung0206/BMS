var myApp = angular.module('myApp', ['ngRoute', 'ngCookies']);

myApp.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);

myApp.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

myApp.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider)  {
    $routeProvider.when('/', {
        templateUrl:'templates/adminhtml/users/login.html',
        controller:'userController',
    });

    $routeProvider.when('/dashboard', {
        templateUrl:'templates/adminhtml/dashboard/index.html',
        controller:'userController',
        authenticated:true
    });

    $routeProvider.when('/post', {
        templateUrl:'templates/adminhtml/post/index.html',
        controller:'postController',
        authenticated:true
    });

    $routeProvider.when('/post/add', {
        templateUrl:'templates/adminhtml/post/add.html',
        controller:'postController',
        authenticated:true
    });

    $routeProvider.when('/category', {
        templateUrl:'templates/adminhtml/category/index.html',
        controller:'categoryController',
        resolve: {
            data: function(categoryModel) {
                return {
                    categories: categoryModel.getAllCategories()
                };
            }
        },
        authenticated:true,
    });

    $routeProvider.otherwise('/');
}]);

myApp.run(['$rootScope', '$location', 'userModel', function($rootScope, $location, userModel){
    $rootScope.$on('$routeChangeStart', function(event, next, current){
        if(next.$$route.authenticated){
            if(!userModel.getAuthStatus()){
                $location.path('/');
            }
        }

        if(next.$$route.originalPath == '/'){
            if(userModel.getAuthStatus()){
                $location.path('/dashboard');
            }
        }
    });
}]);
//# sourceMappingURL=app.js.map
