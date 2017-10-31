myApp.controller('categoryController', ['$scope', '$rootScope', 'categoryModel', 'data', function($scope, $rootScope, categoryModel, data){
    angular.extend($scope, {
        n_category:{
            name: '',
            description: '',
            is_active: '1',
            page_title: '',
        },
        currentPage : 1,
        pageSize_category: 10,
    });

    /*Getting all the categories*/
    if (data && data.categories != undefined) {
        data.categories.then(function(response) {
            $scope.categories = response.data;
            $scope.showCategory = true;
        });
    }

    /*functions*/
    angular.extend($scope, {
        addNewCategory: function (addCategoryForm) {
            if(addCategoryForm.$valid){
                $scope.formSubmitted = false;
                categoryModel.addNewCategory($scope.n_category)
                .then(function(response) {
                    if(response.status == 201){
                        $scope.categories.push(response.data);
                        $scope.n_category = {
                            name: '',
                                description: '',
                                is_active: '1',
                                page_title: '',
                        }
                        $scope.$emit('showMessage', ['success', 'Success', 'Create category: ' + response.data.name + ' success !']);
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
        editCategory: function (categoryId) {
            console.log(categoryId);
        },
        deleteCategory: function (categoryId, categoryName) {
            data = {
                titleDialog: 'Confirm Delete Category: '+categoryName,
                messageDialog: null,
                titleClose: null,
                titleOk: null,
                functionExecute: function () {
                    categoryModel.deleteCategory(categoryId)
                        .then(function(response) {
                            $scope.categories = response.data;
                        })
                        .catch(function(response) {
                            console.log(response);
                        }).finally(function () {
                            $scope.$emit('hideDialogConfig', data);
                        });
                }
            }
            $scope.$emit('showDialogConfig', data);
        }


    });
}]);