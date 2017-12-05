myApp.controller('navController', ['$scope', '$location', 'userModel', function($scope, $location, userModel){
	angular.extend($scope, {
		user: userModel.getUserObject(),
	 	navUrl: [{
            link: 'Xuất hàng',
            subMenu: [{
                link: 'Danh sách hóa đơn',
                url: '/order/view'
            }, {
                link: 'Thêm hóa đơn',
                url: '/order/add'
            },{
                link: 'divider'
            }, {
                link: 'Danh sách khách hàng',
                url: '/customer'
            }]
        },{
            link: 'Nhập hàng',
            subMenu: [{
                link: 'Danh sách hóa đơn',
                url: '/purchaseorder/view'
            }, {
                link: 'Thêm hóa đơn',
                url: '/purchaseorder/add'
            },{
                link: 'divider'
            }, {
                link: 'Danh sách nhà cung cấp',
                url: '/supplier'
            }]
        },{
            link: 'Sản phẩm',
            url: '/product'
        },{
            link: 'Mùa vụ',
            url: '/season'
        },{
            link: 'Báo cáo',
            url: '/report'
        }
        // ,{
        //     link: 'Customers',
        //     url: '/customer'
        // },{
        //     link: 'Orders',
        //     url: '/order',
        //     subMenu: [{
        //         link: 'View all Order',
        //         url: '/order/view'
        //     }, {
        //         link: 'Add new order',
        //         url: '/order/add'
        //     },{
        //         link: 'divider'
        //     }, {
        //         link: 'Add new order',
        //         url: '/order/add'
        //     }]
        // },{
        //     link: 'Suppliers',
        //     url: '/supplier'
        // },{
        //     link: 'P.O',
        //     url: '/purchaseorder',
        //     subMenu: [{
        //         link: 'View all P.O',
        //         url: '/purchaseorder/view'
        //     }, {
        //         link: 'Add new P.O',
        //         url: '/purchaseorder/add'
        //     }]
        // },{
        //     link: 'Products',
        //     url: '/product'
        // },{
        //     link: 'Seasons',
        //     url: '/season'
        // }
        ]
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