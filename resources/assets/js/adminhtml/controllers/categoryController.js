myApp.controller('categoryController', ['$scope', 'categoryModel', 'data', function($scope, categoryModel, data){
    /*Getting all the categories*/
    if (data && data.categories != undefined) {
        data.categories.then(function(response) {
            $scope.categories = response.data;
            console.log('Categories loaded', $scope.categories);
            $scope.showCategory = true;
        });
    }
}]);