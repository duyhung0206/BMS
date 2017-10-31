var myApp = angular.module('myApp', ['ngRoute', 'ngCookies', 'angularUtils.directives.dirPagination', 'angular-loading-bar']);

myApp.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);

myApp.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
