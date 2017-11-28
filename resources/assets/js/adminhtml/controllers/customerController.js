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
                        $scope.$emit('showMessage', ['success', 'Success', 'Create customer: ' + response.data.name + ' success !']);
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
                    $scope.$emit('showMessage', ['danger', 'Error', messageError]);
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
                        $scope.$emit('showMessage', ['success', null, 'Save customer success']);
                        $scope.n_customer = response.data;
                    })
                    .catch(function(response) {

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
                            $scope.customers = response.data;
                        })
                        .catch(function(response) {
                        }).finally(function () {
                            $scope.$emit('hideDialogConfig', data);
                        });
                }
            }
            $scope.$emit('showDialogConfig', data);
        }


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

    $stateProvider.state(infoState);
    $stateProvider.state(ordersState);
}]);