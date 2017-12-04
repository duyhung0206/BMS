myApp.factory('seasonModel', ['$http', function($http){
    return {
        addNewSeason: function(SeasonData){
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'season',
                method: 'POST',
                data: SeasonData
            });
        },
        getAllSeasons: function () {
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: baseUrl + 'season',
                method: "GET",
            });
        },
        deleteSeason: function (seasonId) {
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'season/'+ seasonId,
                method: 'DELETE'
            });
        },
        getDataSeason: function (seasonId) {
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'season/'+ seasonId,
                method: 'GET'
            });
        },
        saveSeason: function (SeasonData) {
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'season/' + SeasonData.id,
                method: 'PUT',
                data: SeasonData
            });
        }
    };
}])