myApp.factory('customerModel', ['$http', function($http){
    return {
        addNewCustomer: function(CustomerData){
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'customer',
                method: 'POST',
                data: CustomerData
            });
        },
        getAllCustomers: function () {
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: baseUrl + 'customer',
                method: "GET",
            });
        },
        deleteCustomer: function (customerId) {
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'customer/'+ customerId,
                method: 'DELETE'
            });
        },
        getDataCustomer: function (customerId) {
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'customer/'+ customerId,
                method: 'GET'
            });
        },
        saveCustomer: function (CustomerData) {
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'customer/' + CustomerData.id,
                method: 'PUT',
                data: CustomerData
            });
        }
    };
}])