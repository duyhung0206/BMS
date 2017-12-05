myApp.controller('settingController', ['$scope', '$rootScope', 'Notification', 'seasonModel', 'userModel', '$timeout',
    function($scope, $rootScope, Notification, seasonModel, userModel, $timeout){

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

    $timeout(function(){
        $('body').addClass('loaded');
    }, 700);

    /*Getting all the seasons*/
    seasonModel.getAllSeasons().then(function(response) {
        $scope.seasons = response.data;
        $scope.seasons.unshift({
            id: 0,
            name: 'All'
        })
    });

    $scope.changeTheme = function (theme) {
        $('body').removeClass('loaded');
        $rootScope.n_config.themes.choosed = theme;
        $timeout(function(){
            $('body').addClass('loaded');
            $scope.$emit('showMessage', ['success', null, 'Theme \''+theme+'\' selected.']);
        }, 700);
    }
}]);

