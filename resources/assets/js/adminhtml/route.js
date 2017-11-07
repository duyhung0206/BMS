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

    $routeProvider.when('/season', {
        templateUrl:'templates/adminhtml/season/index.html',
        controller:'seasonController',
        resolve: {
            data: function(seasonModel) {
                return {
                    seasons: seasonModel.getAllSeasons()
                };
            }
        },
        authenticated:true,
    });

    $routeProvider.when('/post/add', {
        templateUrl:'templates/adminhtml/post/add.html',
        controller:'postController',
        authenticated:true
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