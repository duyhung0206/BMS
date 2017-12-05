myApp.controller('seasonController', ['$scope', '$rootScope', 'seasonModel', 'data', 'Notification', '$location', '$route', '$state', '$filter',
    function($scope, $rootScope, seasonModel, data, Notification, $location, $route, $state, $filter){
    angular.extend($scope, {
        n_season:{
            name: '',
            start: '',
            end: '',
            description: '',
            is_active: '1',
        },
        currentPage : 1,
        pageSize_season: 10,
    });

    $('#season_datepicker').datepicker({
        format: "dd/mm/yyyy",
        orientation: "bottom auto",
        language: "vi",
        todayHighlight: true,
        todayBtn: true,
        clearBtn: true,
        autoclose: true
    });


    /*functions*/
    angular.extend($scope, {
        addNewSeason: function (addSeasonForm) {
            if(addSeasonForm.$valid){
                $scope.formSubmitted = false;
                seasonModel.addNewSeason($scope.n_season)
                .then(function(response) {
                    if(response.status == 201){
                        $scope.seasons.push(response.data);
                        $scope.n_season = {
                            name: '',
                            start: '',
                            end: '',
                            description: '',
                            is_active: '1',
                        }
                        Notification.success('The season has been created.');
                    }
                })
                .catch(function(response) {
                    messageError = '';
                    response.data.forEach(function (value, index) {
                        messageError += value;
                        if(index != (response.data.length -1)){
                            messageError += '<br/>';
                        }
                    });
                    Notification.error(messageError);
                });
            }else{
                $scope.formSubmitted = true;
            }
        },
        deleteSeason: function (seasonId, seasonName) {

            data = {
                titleDialog: 'Confirm Delete Season: '+seasonName,
                messageDialog: null,
                titleClose: null,
                titleOk: null,
                functionExecute: function () {
                    seasonModel.deleteSeason(seasonId)
                        .then(function(response) {
                            $scope.seasons = response.data;
                            Notification.success('The season has been deleted.');
                        })
                        .catch(function(response) {
                        }).finally(function () {
                            $scope.$emit('hideDialogConfig', data);
                        });
                }
            }
            $scope.$emit('showDialogConfig', data);
        },
        editSeason: function (seasonId) {
            $location.path('/season/edit/'+seasonId);
        },
        saveSeason: function (editSeasonForm) {
            if(editSeasonForm.$valid){
                $scope.formSubmitted = false;
                seasonModel.saveSeason($scope.n_season)
                    .then(function(response) {
                        $scope.n_season = response.data;

                        $scope.n_season.start = $filter('date')($scope.n_season.start, 'dd/MM/yyyy');
                        $scope.n_season.end = $filter('date')($scope.n_season.end, 'dd/MM/yyyy');

                        $('#season_start').datepicker('setDate', $scope.n_season.start);
                        $('#season_end').datepicker('setDate', $scope.n_season.end);
                        $scope.$emit('showMessage', ['success', null, 'The season has been saved.']);
                    })
                    .catch(function(response) {
                        $scope.$emit('showMessage', ['danger', null, response.data]);
                    });
            }else{
                $scope.formSubmitted = true;
            }
        },
        editPurchaseorder: function (PurchaseorderId) {
            $location.path('/purchaseorder/edit/' + PurchaseorderId);
        },
        editOrder: function (OrderId) {
            $location.path('/order/edit/' + OrderId);
        },
    });

    if($route.current.params.id){
        if (data && data.n_season != undefined) {
            data.n_season.then(function(response) {

                $scope.n_season = response.data;

                $scope.n_season.start = $filter('date')($scope.n_season.start, 'dd/MM/yyyy');
                $scope.n_season.end = $filter('date')($scope.n_season.end, 'dd/MM/yyyy');

            });
        }
        $scope.go = function (state) {
            $state.go(state);
        }
    }else{
        /*Getting all the seasons*/
        if (data && data.seasons != undefined) {
            data.seasons.then(function(response) {
                $scope.seasons = response.data;
                $scope.showSeason = true;
            });
        }
    }
}]);

myApp.config(['$stateProvider',
    function($stateProvider) {

        var infoState = {
            name: 'season-tab-info',
            templateUrl: 'templates/adminhtml/season/tabs/info.html',
            controller: function ($scope) {
                $('#season_datepicker').datepicker({
                    format: "dd/mm/yyyy",
                    orientation: "bottom auto",
                    language: "vi",
                    todayHighlight: true,
                    todayBtn: true,
                    clearBtn: true,
                    autoclose: true
                });

                $('#season_start').datepicker('setDate', $scope.n_season.start);
                $('#season_end').datepicker('setDate', $scope.n_season.end);
            }
        }

        var ordersState = {
            name: 'season-tab-orders',
            templateUrl: 'templates/adminhtml/season/tabs/orders.html'
        }

        var purchaseordersState = {
            name: 'season-tab-purchaseorders',
            templateUrl: 'templates/adminhtml/season/tabs/purchaseorders.html'
        }

        var reportState = {
            name: 'season-tab-report',
            templateUrl: 'templates/adminhtml/season/tabs/report.html'
        }

        $stateProvider.state(infoState);
        $stateProvider.state(ordersState);
        $stateProvider.state(purchaseordersState);
        $stateProvider.state(reportState);
}]);