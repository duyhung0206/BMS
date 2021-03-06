myApp.controller('orderController', ['$scope', '$rootScope', 'orderModel', 'data', '$route', '$location', '$filter', 'customerModel',
    function($scope, $rootScope, orderModel, data, $route, $location, $filter, customerModel){

    var defaultValue = {
        n_order:{
            order_date:'',
            customer_id: 0,
            customer_name: '',
            customer_email: '',
            create_new_customer: false,
            total_item_count: 0,
            total_qty_ordered: 0,
            grand_total: 0,
            total_paid: 0,
            note: '',
            items:[],
            subtotal:0,
            fees:[],
            grand_total:0
        },
        loading_order_customer: true,
        loading_order_items: true,
        loading_order_totals: false,

        show_error_order_customer: false,
        show_error_order_items: false,
        show_error_order_totals: false,

        currentPage : 1,
        pageSize_order: 10,
    };
    angular.extend($scope, defaultValue);


    /*functions*/
    angular.extend($scope, {
            addOrderItem: function () {
                $scope.n_order.items.push({
                    type: false,
                    product_id: firstProductId+'',
                    qty: 0,
                    price:0,
                    row_total:0,
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
                            value.row_total = parseFloat(value.qty) * parseFloat(value.price);
                        }else{
                            if(value.row_total != '' && value.row_total != 0){
                                value.price = parseFloat(value.row_total) / parseFloat(value.qty);
                            }
                        }
                    }else{
                        if(value.price != '' && value.price != 0){
                            if(value.row_total != '' && value.row_total != 0){
                                value.qty = parseFloat(value.row_total) / parseFloat(value.price);
                            }
                        }
                    }
                    total_qty += parseFloat(value.qty);
                    if(value.type == 0){
                        subtotal += parseFloat(value.row_total);
                    }else{
                        subtotal -= parseFloat(value.row_total);
                    }
                });

                $scope.n_order.total_qty_ordered = total_qty;
                $scope.n_order.subtotal = subtotal;

                var total_fee = 0;
                $scope.n_order.fees.forEach(function (value, key) {
                    total_fee += parseFloat(value.value);
                })

                $scope.n_order.total_paid = $scope.n_order.total_paid == '' ? 0:$scope.n_order.total_paid;
                $scope.n_order.grand_total = parseFloat($scope.n_order.subtotal) + parseFloat(total_fee) - parseFloat($scope.n_order.total_paid);
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
                        ||value.row_total == '' || value.row_total == 0){
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
                    $scope.$emit('showMessage', ['danger', null, 'Vui lòng kiểm tra lại thông tin đơn hàng.']);
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
                            $scope.$emit('showMessage', ['success', null, 'Đơn hàng đã được tạo']);
                            if($scope.n_order.create_new_customer = true){
                                customerModel.getAllCustomers().then(function(responseCustomer) {
                                    responseCustomer.data.push({id:0, name:'Khách hàng khác'});
                                    $scope.customers = responseCustomer.data;
                                    $scope.n_order.customer_id = (response.data.customer_id);
                                    $scope.loading_order_customer = false;
                                    $scope.n_order.create_new_customer = false;
                                });
                            }
                            $location.path('/order/edit/' + response.data.id);
                        })
                        .catch(function(response) {
                            $scope.$emit('showMessage', ['danger', null, response.data]);
                        }).finally(function () {

                    });
                }
            },
            viewOrder: function (order_id) {
                $location.path('/order/edit/' + order_id);
            },
            saveOrder: function () {
                this.recalculate();
                if(this.validateOrder()){
                    orderModel.saveOrder($scope.n_order)
                        .then(function(response) {
                            $scope.$emit('showMessage', ['success', null, 'Đơn hàng đã được lưu']);
                            if($scope.n_order.create_new_customer = true){
                                customerModel.getAllCustomers().then(function(responseCustomer) {
                                    responseCustomer.data.push({id:0, name:'Khách hàng khác'});
                                    $scope.customers = responseCustomer.data;
                                    $scope.n_order.customer_id = (response.data.customer_id);
                                    $scope.loading_order_customer = false;
                                    $scope.n_order.create_new_customer = false;
                                });
                            }else {
                                $scope.n_order = response.data;
                            }
                        })
                        .catch(function(response) {
                            $scope.$emit('showMessage', ['danger', null, response.data]);
                        }).finally(function () {

                        });
                }
            },
            deleteOrder: function () {
                var order_id = $scope.n_order.id;
                data = {
                    titleDialog: 'Xác nhận xóa đơn hàng #'+$scope.n_order.increment_id,
                    messageDialog: null,
                    titleClose: null,
                    titleOk: null,
                    functionExecute: function () {
                        orderModel.deleteOrder(order_id)
                            .then(function(response) {
                                $location.path('/order/view');
                                $scope.$emit('showMessage', ['success', null, 'Đơn hàng đã đc xóa.']);
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

    $('#order_date').datepicker({
        format: "dd/mm/yyyy",
        orientation: "bottom auto",
        language: "vi",
        todayHighlight: true,
        todayBtn: "linked",
        clearBtn: true,
        autoclose: true
    })



    var firstProductId = 0;


    if (data && data.products != undefined) {
        data.products.then(function(response) {
            response.data.push({id:0, name:'Khách hàng khác'});
            $scope.products = response.data;
            $scope.loading_order_items = false;
        });
    }


    if (data && data.customers != undefined) {
        data.customers.then(function(response) {
            response.data.push({id:0, name:'Khách hàng khác'});
            $scope.customers = response.data;
            $scope.loading_order_customer = false;
        });
    }

    if (data && data.orders != undefined) {
        data.orders.then(function(response) {
            $scope.orders = response.data;
        });
    }

    if($route.current.params.id){
        orderModel.getOrderById($route.current.params.id).then(function(response) {
            $scope.n_order = response.data;
            $scope.n_order.order_date = $filter('date')($scope.n_order.order_date, 'dd/MM/yyyy');
            var customerExist = false;
            $scope.customers.forEach(function (value) {
                if(response.data.customer_id == value.id){
                    customerExist = true;
                    return;
                }
            });
            if(!customerExist){
                $scope.n_order.customer_id = 0;
                $scope.n_order.customer_name =  response.data.customer_name;
                $scope.n_order.create_new_customer = true;
            }
            $('#order_date').datepicker("setDate",$scope.n_order.order_date);
            $scope.head_order = 'Đơn hàng #' + response.data.increment_id;
            $scope.new_order = false;

            $scope.recalculate();
        });
    }else{
        $scope.head_order = 'Xuất hàng';
        $scope.new_order = true;
    }
}]);