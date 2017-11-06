myApp.factory('userModel', ['$http', '$cookies', function($http, $cookies){
    var userModel = {};
    userModel.doLogin = function(data){
        return	$http({
            headers:{
                'Content-Type':'application/json'
            },
            method: 'POST',
            url: baseUrl + 'auth',
            data:data
        }).then(
            function successCallback(response) {
                $cookies.put('auth', JSON.stringify(response));
            },
            function errorCallback(response) {
                $cookies.remove('auth');
            }
        );
    };
    userModel.doLogout = function(){
        $cookies.remove('auth');
    }

    userModel.getAuthStatus = function(){
        var status = $cookies.get('auth');
        if(status){
            return true;
        }
        return false;
    }

    userModel.getUserObject = function(){
        if($cookies.get('auth')){
            var userObj = angular.fromJson($cookies.get('auth')).data;
            return userObj;
        }
        return false;
    }

    return userModel;
}]);