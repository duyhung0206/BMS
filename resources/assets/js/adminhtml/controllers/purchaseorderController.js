myApp.controller('purchaseorderController', ['$scope', '$rootScope', 'purchaseorderModel', 'data', '$route', '$location', '$filter', 'supplierModel', 'purchaseorderModel',
    function($scope, $rootScope, purchaseorderModel, data, $route, $location, $filter, supplierModel, purchaseorderModel){

    var defaultValue = {
        n_purchaseorder:{
            order_date:'',
            supplier_id: 0,
            supplier_name: '',
            supplier_email: '',
            create_new_supplier: false,
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
        loading_purchaseorder_supplier: true,
        loading_purchaseorder_items: true,
        loading_purchaseorder_totals: false,

        show_error_purchaseorder_supplier: false,
        show_error_purchaseorder_items: false,
        show_error_purchaseorder_totals: false,

        currentPage : 1,
        pageSize_purchaseorder: 10,
    };
    angular.extend($scope, defaultValue);


    /*functions*/
    angular.extend($scope, {
            addPurchaseorderItem: function () {
                $scope.n_purchaseorder.items.push({
                    type: false,
                    product_id: firstProductId+'',
                    qty: 0,
                    price:0,
                    row_total:0,
                    error: false,
                });
            },
            removePurchaseorderItem: function (index) {
                $scope.n_purchaseorder.items.splice(index, 1);
                this.recalculate();
            },
            addNewFee: function () {
                $scope.n_purchaseorder.fees.push({
                    title: '',
                    value: '',
                    error: false,
                });
            },
            removeFee: function (index) {
                $scope.n_purchaseorder.fees.splice(index, 1);
                this.recalculate();
            },
            recalculate:function () {
                $scope.loading_purchaseorder_items = true;
                var total_qty = 0;
                var subtotal = 0;
                $scope.n_purchaseorder.items.forEach(function (value, key) {
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

                $scope.n_purchaseorder.total_qty_ordered = total_qty;
                $scope.n_purchaseorder.subtotal = subtotal;

                var total_fee = 0;
                $scope.n_purchaseorder.fees.forEach(function (value, key) {
                    total_fee += parseFloat(value.value);
                })

                $scope.n_purchaseorder.total_paid = $scope.n_purchaseorder.total_paid == '' ? 0:$scope.n_purchaseorder.total_paid;
                $scope.n_purchaseorder.grand_total = parseFloat($scope.n_purchaseorder.subtotal) + parseFloat(total_fee) - parseFloat($scope.n_purchaseorder.total_paid);
                $scope.loading_purchaseorder_items = false;
            },
            validatePurchaseorder: function () {
                $scope.show_error_purchaseorder_supplier = false;
                $scope.show_error_purchaseorder_items = false;
                $scope.show_error_purchaseorder_totals = false;

                /*check account info*/
                if($scope.n_purchaseorder.order_date == '' ||
                    $scope.n_purchaseorder.order_date == null ||
                    ($scope.n_purchaseorder.supplier_id == 0 && $scope.n_purchaseorder.create_new_supplier == true && $scope.n_purchaseorder.supplier_name == '')){
                    $scope.show_error_purchaseorder_supplier = true;
                }

                /*check purchaseorder items*/
                $scope.n_purchaseorder.items.forEach(function (value, key) {
                    if(value.qty == '' || value.qty == 0
                        || value.price == '' || value.price == 0
                        ||value.row_total == '' || value.row_total == 0){
                        $scope.show_error_purchaseorder_items = true;
                        value.error = true;
                    }else{
                        value.error = false;
                    }
                });

                /*checl purchaseorder totals*/
                $scope.n_purchaseorder.fees.forEach(function (value, key) {
                    if(value.title == '' || value.value == '' || value.value == 0){
                        $scope.show_error_purchaseorder_totals = true;
                        value.error = true;
                    }else{
                        value.error = false;
                    }
                });

                if($scope.n_purchaseorder.items.length == 0 &&
                    $scope.n_purchaseorder.fees.length == 0 &&
                    $scope.show_error_purchaseorder_supplier == false &&
                    $scope.n_purchaseorder.total_paid == 0){
                    $scope.$emit('showMessage', ['danger', null, 'Purchaseorder don\'t have data. Please check purchaseorder data again!']);
                    return false;
                }

                /*show message*/
                if($scope.show_error_purchaseorder_totals == true || $scope.show_error_purchaseorder_items == true || $scope.show_error_purchaseorder_supplier == true){
                    return false;
                }
                return true;
            },
            placePurchaseorder: function () {
                this.recalculate();
                if(this.validatePurchaseorder()){
                    purchaseorderModel.addNewPurchaseorder($scope.n_purchaseorder)
                        .then(function(response) {
                            $scope.$emit('showMessage', ['success', null, 'The purchaseorder has been created.']);
                            if($scope.n_purchaseorder.create_new_supplier = true){
                                supplierModel.getAllSuppliers().then(function(responseSupplier) {
                                    responseSupplier.data.push({id:0, name:'Other'});
                                    $scope.suppliers = responseSupplier.data;
                                    $scope.n_purchaseorder.supplier_id = (response.data.supplier_id);
                                    $scope.loading_purchaseorder_supplier = false;
                                    $scope.n_purchaseorder.create_new_supplier = false;
                                });
                            }
                            $location.path('/purchaseorder/edit/' + response.data.id);
                        })
                        .catch(function(response) {
                            $scope.$emit('showMessage', ['danger', 'Error', response.data]);
                        }).finally(function () {

                    });
                }
            },
            viewPurchaseorder: function (purchaseorder_id) {
                $location.path('/purchaseorder/edit/' + purchaseorder_id);
            },
            savePurchaseorder: function () {
                this.recalculate();
                if(this.validatePurchaseorder()){
                    purchaseorderModel.savePurchaseorder($scope.n_purchaseorder)
                        .then(function(response) {
                            $scope.$emit('showMessage', ['success', null, 'The purchaseorder has been saved.']);
                            if($scope.n_purchaseorder.create_new_supplier = true){
                                supplierModel.getAllSuppliers().then(function(responseSupplier) {
                                    responseSupplier.data.push({id:0, name:'Other'});
                                    $scope.suppliers = responseSupplier.data;
                                    $scope.n_purchaseorder.supplier_id = (response.data.supplier_id);
                                    $scope.loading_purchaseorder_supplier = false;
                                    $scope.n_purchaseorder.create_new_supplier = false;
                                });
                            }
                        })
                        .catch(function(response) {
                            $scope.$emit('showMessage', ['danger', null, response.data]);
                        }).finally(function () {

                    });
                }
            },
            deletePurchaseorder: function () {
                var purchaseorder_id = $scope.n_purchaseorder.id;
                data = {
                    titleDialog: 'Confirm delete purchaseorder: #'+$scope.n_purchaseorder.increment_id,
                    messageDialog: null,
                    titleClose: null,
                    titleOk: null,
                    functionExecute: function () {
                        purchaseorderModel.deletePurchaseorder(purchaseorder_id)
                            .then(function(response) {
                                $location.path('/purchaseorder/view');
                                $scope.$emit('showMessage', ['success', null, 'The purchaseorder has been deleted.']);
                            })
                            .catch(function(response) {

                            }).finally(function () {
                            $scope.$emit('hideDialogConfig', data);
                            });
                    }
                }
                $scope.$emit('showDialogConfig', data);
            },

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
            response.data.push({id:0, name:'Other'});
            $scope.products = response.data;
            $scope.loading_purchaseorder_items = false;
        });
    }


    if (data && data.suppliers != undefined) {
        data.suppliers.then(function(response) {
            response.data.push({id:0, name:'Other'});
            $scope.suppliers = response.data;
            $scope.loading_purchaseorder_supplier = false;
        });
    }

    if (data && data.purchaseorders != undefined) {
        data.purchaseorders.then(function(response) {
            $scope.purchaseorders = response.data;
        });
    }

    if($route.current.params.id){
        purchaseorderModel.getPurchaseorderById($route.current.params.id).then(function(response) {
            $scope.n_purchaseorder = response.data;
            $scope.n_purchaseorder.order_date = $filter('date')($scope.n_purchaseorder.order_date, 'dd/MM/yyyy');
            var supplierExist = false;
            $scope.suppliers.forEach(function (value) {
                if(response.data.supplier_id == value.id){
                    supplierExist = true;
                    return;
                }
            });
            if(!supplierExist){
                $scope.n_purchaseorder.supplier_id = 0;
                $scope.n_purchaseorder.supplier_name =  response.data.supplier_name;
                $scope.n_purchaseorder.create_new_supplier = true;
            }
            $('#order_date').datepicker("setDate",$scope.n_purchaseorder.order_date);
            $scope.head_purchaseorder = 'P.O #' + response.data.increment_id;
            $scope.new_purchaseorder = false;

            $scope.recalculate();
        }).catch(function (response) {
            $scope.$emit('showMessage', ['danger', null, 'Purchaseorder has id ' + $route.current.params.id + ' don\'t exist !']);
            $location.path('/purchaseorder/view');
        })
    }else{
        $scope.head_purchaseorder = 'New purchaseorder';
        $scope.new_purchaseorder = true;
    }
}]);