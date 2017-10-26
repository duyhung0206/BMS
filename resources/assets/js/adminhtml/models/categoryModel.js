myApp.factory('categoryModel', ['$http', function($http){
    return {
        addNewCategory: function(CategoryData){
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'category',
                method: 'POST',
                data: CategoryData
            });
        },
        getAllCategories: function () {
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: baseUrl + 'category',
                method: "GET",
            });
        },
        deleteCategory: function (categoryId) {
            console.log(categoryId);
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'category/delete/'+ categoryId,
                method: 'POST'
            });
        }
    };
}])