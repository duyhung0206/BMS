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

    $routeProvider.when('/customer', {
        templateUrl:'templates/adminhtml/customer/index.html',
        controller:'customerController',
        resolve: {
            data: function(customerModel) {
                return {
                    customers: customerModel.getAllCustomers()
                };
            }
        },
        authenticated:true,
    });

    $routeProvider.when('/customer/edit/:id', {
        templateUrl: 'templates/adminhtml/customer/edit.html',
        controller: 'customerController',
        resolve: {
            data: function($route, customerModel) {
                return {
                    n_customer: customerModel.getDataCustomer($route.current.params.id),
                };
            }
        },
        authenticated: true
    });

    $routeProvider.when('/supplier', {
        templateUrl:'templates/adminhtml/supplier/index.html',
        controller:'supplierController',
        resolve: {
            data: function(supplierModel) {
                return {
                    suppliers: supplierModel.getAllSuppliers()
                };
            }
        },
        authenticated:true,
    });

    $routeProvider.when('/supplier/edit/:id', {
        templateUrl: 'templates/adminhtml/supplier/edit.html',
        controller: 'supplierController',
        resolve: {
            data: function($route, supplierModel) {
                return {
                    n_supplier: supplierModel.getDataSupplier($route.current.params.id),
                };
            }
        },
        authenticated: true
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


    $routeProvider.when('/season/edit/:id', {
        templateUrl: 'templates/adminhtml/season/edit.html',
        controller: 'seasonController',
        resolve: {
            data: function($route, seasonModel) {
                return {
                    n_season: seasonModel.getDataSeason($route.current.params.id),
                };
            }
        },
        authenticated: true
    });

    /*product*/
    $routeProvider.when('/product', {
        templateUrl:'templates/adminhtml/product/index.html',
        controller:'productController',
        resolve: {
            data: function(productModel,supplierModel) {
                return {
                    products: productModel.getAllProducts(),
                    suppliers: supplierModel.getAllSuppliers()
                };
            }
        },
        authenticated:true,
    });

    $routeProvider.when('/product/edit/:id', {
        templateUrl: 'templates/adminhtml/product/edit.html',
        controller: 'productController',
        resolve: {
            data: function($route, productModel, supplierModel) {
                return {
                    n_product: productModel.getDataProduct($route.current.params.id),
                    suppliers: supplierModel.getAllSuppliers()
                };
            }
        },
        authenticated: true
    });

    /*order*/
    $routeProvider.when('/order/add', {
        templateUrl: 'templates/adminhtml/order/order-add.html',
        controller: 'orderController',
        resolve: {
            data: function(orderModel, productModel, customerModel) {
                return {
                    products: productModel.getAllProducts(),
                    customers: customerModel.getAllCustomers(),
                };
            }
        },
        authenticated: true
    });

    $routeProvider.when('/order/view', {
        templateUrl: 'templates/adminhtml/order/order-view.html',
        controller: 'orderController',
        resolve: {
            data: function(orderModel) {
                return {
                    orders: orderModel.getAllOrders()
                };
            }
        },
        authenticated: true
    });

    $routeProvider.when('/order/edit/:id', {
        templateUrl: 'templates/adminhtml/order/order-add.html',
        controller: 'orderController',
        resolve: {
            data: function(productModel, customerModel) {
                return {
                    products: productModel.getAllProducts(),
                    customers: customerModel.getAllCustomers(),
                };
            }
        },
        authenticated: true
    });

    /*purchase order*/
    $routeProvider.when('/purchaseorder/add', {
        templateUrl: 'templates/adminhtml/purchaseorder/purchaseorder-add.html',
        controller: 'purchaseorderController',
        resolve: {
            data: function(purchaseorderModel, productModel, supplierModel) {
                return {
                    products: productModel.getAllProducts(),
                    suppliers: supplierModel.getAllSuppliers(),
                };
            }
        },
        authenticated: true
    });

    $routeProvider.when('/purchaseorder/view', {
        templateUrl: 'templates/adminhtml/purchaseorder/purchaseorder-view.html',
        controller: 'purchaseorderController',
        resolve: {
            data: function(purchaseorderModel) {
                return {
                    purchaseorders: purchaseorderModel.getAllPurchaseorders()
                };
            }
        },
        authenticated: true
    });

    $routeProvider.when('/purchaseorder/edit/:id', {
        templateUrl: 'templates/adminhtml/purchaseorder/purchaseorder-add.html',
        controller: 'purchaseorderController',
        resolve: {
            data: function(productModel, supplierModel) {
                return {
                    products: productModel.getAllProducts(),
                    suppliers: supplierModel.getAllSuppliers(),
                };
            }
        },
        authenticated: true
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