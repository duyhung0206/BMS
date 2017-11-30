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
        switch (args[0]){
            case 'danger':
                Notification.error(args[2]);
                break;
            case 'success':
                Notification.success(args[2]);
                break;
        }
        //$scope.showMessage(args[0], args[1], args[2]);
    });

}]);
