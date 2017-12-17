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

    $rootScope.notification = {
        delay: 7000,
        startTop: 70,
        startRight: 10,
        verticalSpacing: 10,
        horizontalSpacing: 10,
        positionX: 'left',
        positionY: 'top',
        replaceMessage: true
    }

    $rootScope.$on('showMessage', function(event, args) {
        switch (args[0]){
            case 'danger':
                Notification.error($.extend({message:args[2]}, $rootScope.notification));
                break;
            case 'success':
                Notification.success($.extend({message:args[2]}, $rootScope.notification));
                break;
        }
        //$scope.showMessage(args[0], args[1], args[2]);
    });

}]);
