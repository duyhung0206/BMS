myApp.controller('notifyController', ['$scope', '$rootScope', '$timeout', 'Notification',
    function($scope, $rootScope, $timeout, Notification){

    /*variables*/
    angular.extend($scope, {
        alerts:[]
    });
    /*functions*/
    angular.extend($scope, {
        showMessage: function (type, title, message) {
            $scope.alerts.unshift({
                type: type,
                title: title,
                message: message
            });
            $timeout( function(){
                $scope.alerts.pop();
            }, 5000 );
        }

    });
    $rootScope.$on('showMessage', function(event, args) {
        console.log($rootScope.n_config);
        switch (args[0]){
            case 'danger':
                Notification.error($.extend({message:args[2]}, $rootScope.n_config.notification));
                break;
            case 'success':
                Notification.success($.extend({message:args[2]}, $rootScope.n_config.notification));
                break;
        }
        //$scope.showMessage(args[0], args[1], args[2]);
    });

}]);
