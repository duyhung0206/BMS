myApp.controller('supplierController', ['$scope', '$rootScope', 'supplierModel', 'data', function($scope, $rootScope, supplierModel, data){
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

    /*Getting all the suppliers*/
    if (data && data.suppliers != undefined) {
        data.suppliers.then(function(response) {
            $scope.suppliers = response.data;
            $scope.showSupplier = true;
        });
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
                        $scope.$emit('showMessage', ['success', 'Success', 'Create supplier: ' + response.data.name + ' success !']);
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
        editSupplier: function (supplierId) {
            console.log(supplierId);
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
                            $scope.suppliers = response.data;
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