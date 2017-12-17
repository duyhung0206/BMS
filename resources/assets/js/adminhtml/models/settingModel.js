myApp.factory('settingModel', ['$http', function($http){
    return {
        getAllSettings: function () {
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: baseUrl + 'setting',
                method: "GET",
            });
        },
        saveSetting: function (SettingData) {
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'setting',
                method: 'POST',
                data: SettingData
            });
        }
    };
}])