myApp.controller('seasonController', ['$scope', '$rootScope', 'seasonModel', 'data', function($scope, $rootScope, seasonModel, data){
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

    /*Getting all the seasons*/
    if (data && data.seasons != undefined) {
        data.seasons.then(function(response) {
            $scope.seasons = response.data;
            $scope.showSeason = true;
        });
    }

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
            console.log(addSeasonForm);
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
                        $scope.$emit('showMessage', ['success', 'Success', 'Create season: ' + response.data.name + ' success !']);
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
                    messageError = messageError==''?'Error while process function !':messageError;
                    $scope.$emit('showMessage', ['danger', 'Error', messageError]);
                });
            }else{
                $scope.formSubmitted = true;
            }
        },
        editSeason: function (seasonId) {
            console.log(seasonId);
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
                        })
                        .catch(function(response) {
                            console.log(response);
                        }).finally(function () {
                            $scope.$emit('hideDialogConfig', data);
                        });
                }
            }
            $scope.$emit('showDialogConfig', data);
        }


    });
}]);