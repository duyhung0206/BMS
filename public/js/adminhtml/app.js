var myApp = angular.module('myApp', ['ngRoute', 'ngCookies', 'angularUtils.directives.dirPagination', 'angular-loading-bar']);

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
myApp.factory('errorInterceptor', ['$location', '$rootScope', '$cookies' , '$window', '$q',
    function ($location, $rootScope, $cookies, $window, $q) {

        var requestRecoverer = {
            responseError: function (response) {
                if (response && response.status === 501) {
                    if($location.url() != '/'){
                        $cookies.remove('auth');
                        $window.location.href = baseUrl;
                    }
                }
                return $q.reject(response);
            }
        };

        return requestRecoverer;
    }]);

myApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('errorInterceptor');
});
myApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    // cfpLoadingBarProvider.spinnerTemplate = '<div class="over-load"></div><div class="cssload-thecube"><div class="cssload-cube cssload-c1"></div><div class="cssload-cube cssload-c2"></div><div class="cssload-cube cssload-c4"></div><div class="cssload-cube cssload-c3"></div></div>';
    cfpLoadingBarProvider.spinnerTemplate = '<div class="over-load"></div><div class="loader"></div>';
}])

//# sourceMappingURL=app.js.map
