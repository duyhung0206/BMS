myApp.factory('orderModel', ['$http', function($http){
    return {
        addNewOrder: function(OrderData){
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'order',
                method: 'POST',
                data: OrderData
            });
        },
        getAllOrders: function () {
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: baseUrl + 'order',
                method: "GET",
            });
        },
        deleteOrder: function (orderId) {
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'order/delete/'+ orderId,
                method: 'POST'
            });
        }
    };
}])