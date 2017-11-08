myApp.factory('productModel', ['$http', function($http){
    return {
        addNewProduct: function(ProductData){
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'product',
                method: 'POST',
                data: ProductData
            });
        },
        getAllProducts: function () {
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: baseUrl + 'product',
                method: "GET",
            });
        },
        deleteProduct: function (productId) {
            console.log(productId);
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'product/delete/'+ productId,
                method: 'POST'
            });
        }
    };
}])