myApp.controller('orderController', ['$scope', '$rootScope', 'orderModel', 'data', function($scope, $rootScope, orderModel, data){
    angular.extend($scope, {
        n_order:{
            customer_id: "0",
            customer_name: '',
        },
    });

    /*Getting all the orders*/
    if (data && data.products != undefined) {
        data.products.then(function(response) {
            $scope.products = response.data;
        });
    }

    /*Getting all the orders*/
    if (data && data.customers != undefined) {
        data.customers.then(function(response) {
            response.data.push({id:0, name:'Other'});
            $scope.customers = response.data;
        });
    }

    $('#order_date').datepicker({
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
        addNewOrder: function (addOrderForm) {
            if(addOrderForm.$valid){
                $scope.formSubmitted = false;
                orderModel.addNewOrder($scope.n_order)
                .then(function(response) {
                    if(response.status == 201){
                        $scope.orders.push(response.data);
                        $scope.n_order = {
                            name: '',
                            start: '',
                            end: '',
                            description: '',
                            is_active: '1',
                        }
                        $scope.$emit('showMessage', ['success', 'Success', 'Create order: ' + response.data.name + ' success !']);
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
        editOrder: function (orderId) {
        },
        deleteOrder: function (orderId, orderName) {
            data = {
                titleDialog: 'Confirm Delete Order: '+orderName,
                messageDialog: null,
                titleClose: null,
                titleOk: null,
                functionExecute: function () {
                    orderModel.deleteOrder(orderId)
                        .then(function(response) {
                            $scope.orders = response.data;
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