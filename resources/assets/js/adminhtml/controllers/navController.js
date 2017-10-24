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