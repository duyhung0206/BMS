myApp.factory('supplierModel', ['$http', function($http){
    return {
        addNewSupplier: function(SupplierData){
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'supplier',
                method: 'POST',
                data: SupplierData
            });
        },
        getAllSuppliers: function () {
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: baseUrl + 'supplier',
                method: "GET",
            });
        },
        deleteSupplier: function (supplierId) {
            console.log(supplierId);
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'supplier/'+ supplierId,
                method: 'DELETE'
            });
        }
    };
}])