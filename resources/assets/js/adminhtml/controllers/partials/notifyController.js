myApp.controller('notifyController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){

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
        $scope.showMessage(args[0], args[1], args[2]);
    });

}]);
