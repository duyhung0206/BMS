myApp.controller('supplierController', ['$scope', '$rootScope', 'supplierModel', 'data', '$route', '$location', '$state',
    function($scope, $rootScope, supplierModel, data, $route, $location, $state){
    angular.extend($scope, {
        n_supplier:{
            name: '',
            email: '',
            address: '',
            description: '',
            phone: '',
            note: '',
            is_active: '1',
        },
        currentPage : 1,
        pageSize_supplier: 10,
    });

    if($route.current.params.id){
        if(data && data.n_supplier != undefined){
            data.n_supplier.then(function(response) {
                $scope.n_supplier = response.data;
            }).catch(function(response) {
                $scope.$emit('showMessage', ['danger', null, 'Supplier has id ' + $route.current.params.id + ' don\'t exist !']);
                $location.path('/supplier');
            });
        }
        $scope.go = function (state) {
            $state.go(state);
        }
    }else{
        /*Getting all the suppliers*/
        if (data && data.suppliers != undefined) {
            data.suppliers.then(function(response) {
                $scope.suppliers = response.data;
                $scope.showSupplier = true;
            });
        }
    }


    $('#supplier_datepicker').datepicker({
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
        addNewSupplier: function (addSupplierForm) {
            if(addSupplierForm.$valid){
                $scope.formSubmitted = false;
                supplierModel.addNewSupplier($scope.n_supplier)
                .then(function(response) {
                    if(response.status == 201){
                        $scope.suppliers.push(response.data);
                        $scope.n_supplier = {
                            name: '',
                            email: '',
                            address: '',
                            description: '',
                            phone: '',
                            note: '',
                            is_active: '1',
                        }
                        $scope.$emit('showMessage', ['success', null, 'The supplier has been created.']);
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
        editSupplier: function (supplierId) {
            $location.path('/supplier/edit/'+supplierId);
        },
        deleteSupplier: function (supplierId, supplierName) {
            data = {
                titleDialog: 'Confirm Delete Supplier: '+supplierName,
                messageDialog: null,
                titleClose: null,
                titleOk: null,
                functionExecute: function () {
                    supplierModel.deleteSupplier(supplierId)
                        .then(function(response) {
                            if($route.current.params.id){
                                $location.path('/supplier');
                            }
                            $scope.suppliers = response.data;
                            $scope.$emit('showMessage', ['success', null, 'The supplier has been deleted.']);

                        })
                        .catch(function(response) {
                        }).finally(function () {
                            $scope.$emit('hideDialogConfig', data);
                        });
                }
            }
            $scope.$emit('showDialogConfig', data);
        },
        saveSupplier: function (editSupplierForm) {
            if(editSupplierForm.$valid){
                $scope.formSubmitted = false;
                supplierModel.saveSupplier($scope.n_supplier)
                    .then(function(response) {
                        $scope.$emit('showMessage', ['success', null, 'The supplier has been saved.']);
                        $scope.n_supplier = response.data;
                    })
                    .catch(function(response) {
                        $scope.$emit('showMessage', ['danger', null, response.data]);
                    });
            }else{
                $scope.formSubmitted = true;
            }
        },
        editPurchaseorder: function (PurchaseorderId) {
            $location.path('/purchaseorder/edit/' + PurchaseorderId);
        }
    });
}]);

myApp.config(['$stateProvider',
    function($stateProvider) {

        var infoState = {
            name: 'supplier-tab-info',
            templateUrl: 'templates/adminhtml/supplier/tabs/info.html',
        }

        var ordersState = {
            name: 'supplier-tab-orders',
            templateUrl: 'templates/adminhtml/supplier/tabs/orders.html'
        }

        var productsState = {
            name: 'supplier-tab-products',
            templateUrl: 'templates/adminhtml/supplier/tabs/products.html'
        }

        var reportState = {
            name: 'supplier-tab-report',
            templateUrl: 'templates/adminhtml/supplier/tabs/report.html'
        }

        $stateProvider.state(infoState);
        $stateProvider.state(ordersState);
        $stateProvider.state(productsState);
        $stateProvider.state(reportState);
    }]);