myApp.controller('settingController', ['$scope', '$rootScope', 'Notification', 'seasonModel',
    function($scope, $rootScope, Notification, seasonModel){

    $rootScope.n_config = {
        notification:{
            delay: 7000,
            startTop: 70,
            startRight: 10,
            verticalSpacing: 10,
            horizontalSpacing: 10,
            positionX: 'left',
            positionY: 'top',
            replaceMessage: true
        },
        themes: {
            choosed: 'paper',
            list: ['lumen', 'paper', 'united', 'superhero']
        }
    };
    /*Getting all the seasons*/
    seasonModel.getAllSeasons().then(function(response) {
        $scope.seasons = response.data;
        $scope.seasons.unshift({
            id: 0,
            name: 'All'
        })
    });
}]);