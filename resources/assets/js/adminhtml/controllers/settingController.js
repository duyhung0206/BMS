myApp.controller('settingController', ['$scope', '$rootScope', 'Notification', 'seasonModel', 'settingModel', '$timeout', 'userModel',
    function($scope, $rootScope, Notification, seasonModel, settingModel, $timeout, userModel){
        if(!userModel.getAuthStatus() || $rootScope.n_config == undefined){
            $rootScope.n_config = {
                themes: {
                    list: ['lumen', 'paper', 'united', 'superhero']
                },
                period_default: 0,
                theme_default: 'paper',
            };
            settingModel.getAllSettings().then(function(response) {
                response.data.forEach(function (config) {
                    switch (config.path){
                        case 'period_default':
                            $rootScope.n_config.period_default = config.value;
                            break;
                        case 'theme_default':
                            $rootScope.n_config.theme_default = config.value;
                            break;
                    }
                })
            });
        }else{
            /*Getting all the seasons*/
            seasonModel.getAllSeasons().then(function(response) {
                $scope.seasons = response.data;
                $scope.seasons.unshift({
                    id: 0,
                    name: 'Tất cả'
                })
            });
        }

        $scope.changeTheme = function (theme) {
            $('body').removeClass('loaded');
            $rootScope.n_config.theme_default = theme;
            this.saveSetting();
            $timeout(function(){
                $('body').addClass('loaded');
                $timeout(function(){
                    $scope.$emit('showMessage', ['success', null, 'Theme \''+theme+'\' selected.']);
                }, 1000);
            }, 700);
        }
        
        $scope.saveSetting = function (editSettingForm) {
            settingModel.saveSetting($rootScope.n_config)
            .then(function(response) {
                $scope.$emit('showMessage', ['success', null, 'Lưu cài đặt thành công.']);
            })
            .catch(function(response) {
            });
        }
    }]);

