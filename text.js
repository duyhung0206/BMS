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