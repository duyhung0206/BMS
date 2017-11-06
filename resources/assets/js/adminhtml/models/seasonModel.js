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
            console.log(seasonId);
            return $http({
                headers:{
                    'Content-Type':'application/json'
                },
                url: baseUrl + 'season/delete/'+ seasonId,
                method: 'POST'
            });
        }
    };
}])