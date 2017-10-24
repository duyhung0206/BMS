myApp.controller('userController', ['$scope', 'userModel', '$location', function($scope, userModel, $location){

    /*variables*/
    angular.extend($scope, {
        login:{
            username: 'admin@example.com',
            password: 'admin'
        }
    });

    /*functions*/
    angular.extend($scope,{
        doLogin: function(loginForm){
            var data = {
                email: $scope.login.username,
                password: $scope.login.password
            };
            userModel.doLogin(data).then(
                function() {
                    $location.path('/dashboard');
                }
            );
        },
        doLogout: function(){
            userModel.doLogout();
            $location.path('/');
        }
    });
}]);