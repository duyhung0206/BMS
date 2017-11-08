myApp.controller('productController', ['$scope', '$rootScope', 'productModel', 'data', function($scope, $rootScope, productModel, data){
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
                    $scope.$emit('showMessage', ['danger', 'Error', messageError]);
                });
            }else{
                $scope.formSubmitted = true;
            }
        },
        editProduct: function (productId) {
            console.log(productId);
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
                            $scope.products = response.data;
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