myApp.controller('customerController', ['$scope', '$rootScope', 'customerModel', 'data', '$location', '$route', '$state',
    function($scope, $rootScope, customerModel, data, $location, $route, $state){
    angular.extend($scope, {
        n_customer:{
            name: '',
            email: '',
            address: '',
            description: '',
            phone: '',
            note: '',
            is_active: '1',
        },
        currentPage : 1,
        pageSize_customer: 10,
    });

    if($route.current.params.id){
        if(data && data.n_customer != undefined){
            data.n_customer.then(function(response) {
                $scope.n_customer = response.data;
            }).catch(function(response) {
                $scope.$emit('showMessage', ['danger', null, 'Customer has id ' + $route.current.params.id + ' don\'t exist !']);
                $location.path('/customer');
            });
        }
        $scope.go = function (state) {
            $state.go(state);
        }
    }else{
        /*Getting all the customers*/
        if (data && data.customers != undefined) {
            data.customers.then(function(response) {
                $scope.customers = response.data;
                $scope.showCustomer = true;
            });
        }
    }

    $('#customer_datepicker').datepicker({
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
        addNewCustomer: function (addCustomerForm) {
            if(addCustomerForm.$valid){
                $scope.formSubmitted = false;
                customerModel.addNewCustomer($scope.n_customer)
                .then(function(response) {
                    if(response.status == 201){
                        $scope.customers.push(response.data);
                        $scope.n_customer = {
                            name: '',
                            email: '',
                            address: '',
                            description: '',
                            phone: '',
                            note: '',
                            is_active: '1',
                        }
                        $scope.$emit('showMessage', ['success', null, 'The customer \'' + response.data.name + '\' has been created.']);
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
        saveCustomer: function (editCustomerForm) {
            if(editCustomerForm.$valid){
                $scope.formSubmitted = false;
                customerModel.saveCustomer($scope.n_customer)
                    .then(function(response) {
                        $scope.$emit('showMessage', ['success', null, 'The customer has been saved.']);
                        $scope.n_customer = response.data;
                    })
                    .catch(function(response) {
                        $scope.$emit('showMessage', ['danger', null, response.data]);
                    });
            }else{
                $scope.formSubmitted = true;
            }
        },
        editCustomer: function (customerId) {
            $location.path('/customer/edit/'+customerId);
        },
        deleteCustomer: function (customerId, customerName) {
            data = {
                titleDialog: 'Confirm Delete Customer: '+customerName,
                messageDialog: null,
                titleClose: null,
                titleOk: null,
                functionExecute: function () {
                    customerModel.deleteCustomer(customerId)
                        .then(function(response) {
                            if($route.current.params.id){
                                $location.path('/customer');
                            }
                            $scope.customers = response.data;
                            $scope.$emit('showMessage', ['success', null, 'The customer has been deleted.']);
                        })
                        .catch(function(response) {
                        }).finally(function () {
                            $scope.$emit('hideDialogConfig', data);
                        });
                }
            }
            $scope.$emit('showDialogConfig', data);
        },
        editOrder: function (OrderId) {
            $location.path('/order/edit/' + OrderId);
        },
    });
}]);

myApp.config(['$stateProvider',
    function($stateProvider) {
    var infoState = {
        name: 'customer-tab-info',
        templateUrl: 'templates/adminhtml/customer/tabs/info.html',
    }

    var ordersState = {
        name: 'customer-tab-orders',
        templateUrl: 'templates/adminhtml/customer/tabs/orders.html'
    }

    var reportState = {
        name: 'customer-tab-report',
        templateUrl: 'templates/adminhtml/customer/tabs/report.html'
    }

    $stateProvider.state(infoState);
    $stateProvider.state(ordersState);
    $stateProvider.state(reportState);
}]);