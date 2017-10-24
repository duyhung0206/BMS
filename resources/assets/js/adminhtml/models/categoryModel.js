myApp.factory('categoryModel', ['$http', function($http){
    return {
        getAllCategories: function () {
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: baseUrl + 'category',
                method: "GET",
            });
        },
    };
}])