myApp.controller('customerController', ['$scope', '$rootScope', 'customerModel', 'data', function($scope, $rootScope, customerModel, data){
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

    /*Getting all the customers*/
    if (data && data.customers != undefined) {
        data.customers.then(function(response) {
            $scope.customers = response.data;
            $scope.showCustomer = true;
        });
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
        editCustomer: function (customerId) {
            console.log(customerId);
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