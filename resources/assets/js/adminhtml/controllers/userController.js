myApp.controller('userController', ['$scope', 'userModel', '$location',
    function($scope, userModel, $location){

    /*variables*/
    angular.extend($scope, {
        login:{
            username: 'hades@trueplus.vn',
            password: '123',
            error: false
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
                    $scope.login.error = true;
                    $location.path('/dashboard');

                }
            ).catch(function(response) {
                $scope.login.error = false;
            });
        },
        doLogout: function(){
            userModel.doLogout();
            $location.path('/');
        }
    });
}]);