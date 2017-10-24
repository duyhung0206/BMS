myApp.controller('globalController', ['$scope', '$cookies', function($scope, $cookies){
	$scope.global = {};
	$scope.global.navUrl = 'templates/adminhtml/partials/nav.html';
}]);
myApp.controller('userController', ['$scope', 'userModel', '$location', function($scope, userModel, $location){

    /*variables*/
    angular.extend($scope, {
        login:{
            username: 'admin@example.com',
            password: 'admin'
        }
    });

    /*functions*/
    angular.extend($scope,{
        doLogin: function(loginForm){
            var data = {
                email: $scope.login.username,
                password: $scope.login.password
            };
            userModel.doLogin(data).then(
                function() {
                    $location.path('/dashboard');
                }
            );
        },
        doLogout: function(){
            userModel.doLogout();
            $location.path('/');
        }
    });
}]);
myApp.controller('navController', ['$scope', '$location', 'userModel', function($scope, $location, userModel){
	angular.extend($scope, {
		user: userModel.getUserObject(),
	 	navUrl: [{
            link: 'Posts',
            url: '/post',
            subMenu: [{
                link: 'All posts',
                url: '/post'
            }, {
                link: 'Add New',
                url: '/post/add'
            },{
                link: 'Categories',
                url: '/category'
            }]
        }, {
            link: 'Comments',
            url: '/comment'
        }, {
            link: 'Settings',
            url: '/setting'
        }]
	});

	angular.extend($scope, {
		doLogout: function(){
			userModel.doLogout();
			$location.path('/');
		},
        checkActiveLink: function(routeLink){
            if($location.path() == routeLink){
                return 'make-active';
            }
        }
	});

}]);
myApp.controller('categoryController', ['$scope', 'categoryModel', 'data', function($scope, categoryModel, data){
    /*Getting all the categories*/
    console.log(data);
    if (data && data.categories != undefined) {
        data.categories.then(function(response) {
            console.log('Categories loaded');
            console.log(response);
        });
    }
}]);
myApp.controller('postController', ['$scope', function($scope){
}]);
//# sourceMappingURL=controllers.js.map
