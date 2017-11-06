myApp.factory('errorInterceptor', ['$location', '$rootScope', '$cookies' , '$window', '$q',
    function ($location, $rootScope, $cookies, $window, $q) {

        var requestRecoverer = {
            responseError: function (response) {
                if (response && response.status === 501) {
                    if($location.url() != '/'){
                        $cookies.remove('auth');
                        $window.location.href = baseUrl;
                    }
                }
                if (response && response.status === 404) {
                    console.log('test');
                    $rootScope.$emit('showMessage', ['danger', 'Error', 'Request 404 not found !']);
                }
                return $q.reject(response);
            }
        };

        return requestRecoverer;
    }]);

myApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('errorInterceptor');
});