myApp.controller('navController', ['$scope', '$location', 'userModel', function($scope, $location, userModel){
	angular.extend($scope, {
		user: userModel.getUserObject(),
	 	navUrl: [{
            link: 'Customers',
            url: '/customer'
        },{
            link: 'Orders',
            url: '/order',
            subMenu: [{
                link: 'View all Order',
                url: '/order/view'
            }, {
                link: 'Add new order',
                url: '/order/add'
            }]
        },{
            link: 'Suppliers',
            url: '/supplier'
        },{
            link: 'P.O',
            url: '/purchaseorder',
            subMenu: [{
                link: 'View all P.O',
                url: '/purchaseorder/view'
            }, {
                link: 'Add new P.O',
                url: '/purchaseorder/add'
            }]
        },{
            link: 'Products',
            url: '/product'
        },{
            link: 'Seasons',
            url: '/season'
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
        },
        checkActiveLiLink: function(routeLink){
            if($location.path() == routeLink){
                return 'active';
            }
        }
	});

}]);