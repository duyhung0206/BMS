myApp.controller('orderController', ['$scope', '$rootScope', 'orderModel', 'data', function($scope, $rootScope, orderModel, data){
    angular.extend($scope, {
        n_order:{
            order_date:'',
            customer_id: "0",
            customer_name: '',
            customer_email: '',
            create_new_customer: false,
            total_item_count: 0,
            total_qty_orderd: 0,
            total_due: 0,
            total_paid: 0,
            note: '',
            items:[],
            subtotal:0,
            fees:[],
            total_due:0
        },
        loading_order_customer: true,
        loading_order_items: true,
        loading_order_totals: false,

        show_error_order_customer: false,
        show_error_order_items: false,
        show_error_order_totals: false,
    });

    var firstProductId = 0;
    /*Getting all the orders*/
    if (data && data.products != undefined) {
        data.products.then(function(response) {
            response.data.push({id:0, name:'Other'});
            $scope.products = response.data;
            $scope.loading_order_items = false;
        });
    }

    /*Getting all the orders*/
    if (data && data.customers != undefined) {
        data.customers.then(function(response) {
            response.data.push({id:0, name:'Other'});
            $scope.customers = response.data;
            $scope.loading_order_customer = false;
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
        addOrderItem: function () {
            $scope.n_order.items.push({
                type: false,
                product_id: firstProductId+'',
                qty: 0,
                price:0,
                rowtotal:0,
                error: false,
            });
        },
        removeOrderItem: function (index) {
            $scope.n_order.items.splice(index, 1);
            this.recalculate();
        },
        addNewFee: function () {
            $scope.n_order.fees.push({
                title: '',
                value: '',
                error: false,
            });
        },
        removeFee: function (index) {
            $scope.n_order.fees.splice(index, 1);
            this.recalculate();
        },
        recalculate:function () {
            $scope.loading_order_items = true;
            var total_qty = 0;
            var subtotal = 0;
            $scope.n_order.items.forEach(function (value, key) {
                if(value.qty != '' && value.qty != 0){
                    if(value.price != '' && value.price != 0){
                        value.rowtotal = value.qty * value.price;
                    }else{
                        if(value.rowtotal != '' && value.rowtotal != 0){
                            value.price = value.rowtotal / value.qty;
                        }
                    }
                }else{
                    if(value.price != '' && value.price != 0){
                        if(value.rowtotal != '' && value.rowtotal != 0){
                            value.qty = value.rowtotal / value.price;
                        }
                    }
                }
                total_qty += value.qty;
                if(value.type == 0){
                    subtotal += value.rowtotal;
                }else{
                    subtotal -= value.rowtotal;
                }
            });

            $scope.n_order.total_qty_orderd = total_qty;
            $scope.n_order.subtotal = subtotal;

            var total_fee = 0;
            $scope.n_order.fees.forEach(function (value, key) {
                total_fee += value.value;
            })

            $scope.n_order.total_due = $scope.n_order.subtotal + total_fee - $scope.n_order.total_paid;
            $scope.loading_order_items = false;
        },
        validateOrder: function () {
            $scope.show_error_order_customer = false;
            $scope.show_error_order_items = false;
            $scope.show_error_order_totals = false;

            /*check account info*/
            if($scope.n_order.order_date == '' ||
                $scope.n_order.order_date == null ||
                ($scope.n_order.customer_id == 0 && $scope.n_order.create_new_customer == true && $scope.n_order.customer_name == '')){
                $scope.show_error_order_customer = true;
            }

            /*check order items*/
            $scope.n_order.items.forEach(function (value, key) {
                if(value.qty == '' || value.qty == 0
                    || value.price == '' || value.price == 0
                    ||value.rowtotal == '' || value.rowtotal == 0){
                    $scope.show_error_order_items = true;
                    value.error = true;
                }else{
                    value.error = false;
                }
            });

            /*checl order totals*/
            $scope.n_order.fees.forEach(function (value, key) {
                if(value.title == '' || value.value == '' || value.value == 0){
                    $scope.show_error_order_totals = true;
                    value.error = true;
                }else{
                    value.error = false;
                }
            });

            if($scope.n_order.items.length == 0 &&
                $scope.n_order.fees.length == 0 &&
                $scope.show_error_order_customer == false &&
                $scope.n_order.total_paid == 0){
                $scope.$emit('showMessage', ['danger', 'Error', 'Order don\'t have data. Please check order data again!']);
                return false;
            }

            /*show message*/
            if($scope.show_error_order_totals == true || $scope.show_error_order_items == true || $scope.show_error_order_customer == true){
                return false;
            }
            return true;
        },
        placeOrder: function () {
            this.recalculate();
            if(this.validateOrder()){
                orderModel.addNewOrder($scope.n_order)
                .then(function(response) {
                    $scope.$emit('showMessage', ['success', null, 'Create order #'+response.data.increment_id+ ' success !']);
                })
                .catch(function(response) {
                    $scope.$emit('showMessage', ['danger', 'Error', response.data]);
                }).finally(function () {

                });
            }
        }
    });
}]);