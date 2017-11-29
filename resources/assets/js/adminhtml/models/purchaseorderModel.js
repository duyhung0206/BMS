myApp.factory('purchaseorderModel', ['$http', function($http){
    return {
        addNewPurchaseorder: function(PurchaseorderData){
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'purchaseorder',
                method: 'POST',
                data: PurchaseorderData
            });
        },
        getAllPurchaseorders: function () {
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: baseUrl + 'purchaseorder',
                method: "GET",
            });
        },
        deletePurchaseorder: function (purchaseorderId) {
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'purchaseorder/'+ purchaseorderId,
                method: 'DELETE'
            });
        },
        getPurchaseorderById: function (purchaseorderId) {
            return $http.get(
                baseUrl + 'purchaseorder/' + purchaseorderId
            );
        },
        savePurchaseorder: function (PurchaseorderData) {
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'purchaseorder/' + PurchaseorderData.id,
                method: 'PUT',
                data: PurchaseorderData
            });
        }
    };
}])