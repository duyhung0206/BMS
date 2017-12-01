myApp.controller('productController',
    ['$scope', '$rootScope', 'productModel', 'data', '$location', '$route', '$state', 'supplierModel',
    function($scope, $rootScope, productModel, data, $location, $route, $state, supplierModel){
    angular.extend($scope, {
        n_product:{
            sku: '',
            name: '',
            description: '',
            supplier_id : 0,
            supplier_name: '',
            is_active: '1',
        },
        currentPage : 1,
        pageSize_product: 10,
    });


    if($route.current.params.id){
        if(data && data.n_product != undefined){
            data.n_product.then(function(response) {
                $scope.n_product = response.data;
            }).catch(function(response) {
                $scope.$emit('showMessage', ['danger', null, 'Product has id ' + $route.current.params.id + ' don\'t exist !']);
                $location.path('/product');
            });
        }
        if (data && data.suppliers != undefined) {
            data.suppliers.then(function(response) {
                response.data.push({id:0,name:'Other'});
                $scope.suppliers = response.data;
            });
        }
        $scope.go = function (state) {
            $state.go(state);
        }
    }else{
        /*Getting all the products*/
        if (data && data.products != undefined) {
            data.products.then(function(response) {
                $scope.products = response.data;
                if (data && data.suppliers != undefined) {
                    data.suppliers.then(function(response) {
                        response.data.push({id:0,name:'Other'});
                        $scope.suppliers = response.data;
                    });
                }
                $scope.showProduct = true;
            });
        }
    }




    $('#product_datepicker').datepicker({
        format: "dd/mm/yyyy",
        orientation: "bottom auto",
        language: "vi",
        todayHighlight: true,
        todayBtn: true,
        clearBtn: true,
        autoclose: true
    });

    /*functions*/
    angular.extend($scope, {
        addNewProduct: function (addProductForm) {
            if(addProductForm.$valid){
                $scope.formSubmitted = false;
                productModel.addNewProduct($scope.n_product)
                .then(function(response) {
                    if(response.status == 201){
                        $scope.products.push(response.data);
                        $scope.n_product = {
                            create_new_supplier: false,
                            name: '',
                            email: '',
                            address: '',
                            description: '',
                            phone: '',
                            note: '',
                            is_active: '1',
                        }
                        $scope.$emit('showMessage', ['success', 'Success', 'Create product: ' + response.data.name + ' success !']);
                    }
                })
                .catch(function(response) {
                    messageError = '';
                    response.data.forEach(function (value, index) {
                        messageError += value;
                        if(index != (response.data.length -1)){
                            messageError += '<br/>';
                        }
                    });
                    messageError = messageError==''?'Error while process function !':messageError;
                    $scope.$emit('showMessage', ['danger', null, messageError]);
                });
            }else{
                $scope.formSubmitted = true;
            }
        },
        editProduct: function (productId) {
            $location.path('/product/edit/'+productId);
        },
        deleteProduct: function (productId, productName) {
            data = {
                titleDialog: 'Confirm Delete Product: '+productName,
                messageDialog: null,
                titleClose: null,
                titleOk: null,
                functionExecute: function () {
                    productModel.deleteProduct(productId)
                        .then(function(response) {
                            if($route.current.params.id){
                                $location.path('/product');
                            }
                            $scope.products = response.data;
                            $scope.$emit('showMessage', ['success', null, 'The product has been deleted.']);
                        })
                        .catch(function(response) {

                        }).finally(function () {
                            $scope.$emit('hideDialogConfig', data);
                        });
                }
            }
            $scope.$emit('showDialogConfig', data);
        },
        saveProduct: function (editProductForm) {
            if(editProductForm.$valid){
                $scope.formSubmitted = false;
                productModel.saveProduct($scope.n_product)
                    .then(function(response) {
                        $scope.$emit('showMessage', ['success', null, 'The product has been saved.']);
                        if($scope.n_product.create_new_supplier = true){
                            supplierModel.getAllSuppliers().then(function(responseSupplier) {
                                responseSupplier.data.push({id:0, name:'Other'});
                                $scope.suppliers = responseSupplier.data;
                                $scope.n_product.supplier_id = (response.data.supplier_id);
                                $scope.n_product.create_new_supplier = false;
                            });
                        }
                        $scope.n_product = response.data;
                    })
                    .catch(function(response) {
                        console.log(response);
                        $scope.$emit('showMessage', ['danger', null, response.data]);
                    });
            }else{
                $scope.formSubmitted = true;
            }
        },
        editPurchaseorder: function (PurchaseorderId) {
            $location.path('/purchaseorder/edit/' + PurchaseorderId);
        },
        editOrder: function (OrderId) {
            $location.path('/order/edit/' + OrderId);
        },
    });
}]);


myApp.config(['$stateProvider',
    function($stateProvider) {

        var infoState = {
            name: 'product-tab-info',
            templateUrl: 'templates/adminhtml/product/tabs/info.html',
        }

        var ordersState = {
            name: 'product-tab-orders',
            templateUrl: 'templates/adminhtml/product/tabs/orders.html'
        }

        var purchaseordersState = {
            name: 'product-tab-purchaseorders',
            templateUrl: 'templates/adminhtml/product/tabs/purchaseorders.html'
        }

        var reportState = {
            name: 'product-tab-report',
            templateUrl: 'templates/adminhtml/product/tabs/report.html'
        }

        $stateProvider.state(infoState);
        $stateProvider.state(ordersState);
        $stateProvider.state(purchaseordersState);
        $stateProvider.state(reportState);
    }]);