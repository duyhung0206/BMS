myApp.controller('confirmDeleteController', ['$scope', '$rootScope', function($scope, $rootScope){

    /*variables*/
    angular.extend($scope, {
        confirmDelete:{
            titleDialog: 'Xác nhận',
            messageDialog:'...',
            titleOk: 'Xác nhận',
            titleClose: 'Đóng',
            clickOk: function () {
            },
            verification: stringGen(10),
            inputVerification: ''
        }
    });
    /*functions*/
    angular.extend($scope, {
        showDialogConfig: function (titleDialog, messageDialog, titleClose, titleOk, functionExecute) {
            $scope.confirmDelete.titleDialog = titleDialog==null?'Xác nhận':titleDialog;
            $scope.confirmDelete.messageDialog = messageDialog==null?'Nhập mã xác nhận để thực hiện thao tác !':messageDialog;
            $scope.confirmDelete.titleClose = titleClose==null?'Đóng':titleClose;
            $scope.confirmDelete.titleOk = titleOk==null?'Xác nhận':titleOk;
            $scope.confirmDelete.verification = stringGen(10);
            $scope.confirmDelete.inputVerification = '';
            $scope.confirmDelete.error = false;
            $scope.confirmDelete.clickOk = function () {
                if($scope.confirmDelete.verification == $scope.confirmDelete.inputVerification){
                    $scope.confirmDelete.error = false;
                    functionExecute();
                }else{
                    $scope.confirmDelete.error = true;
                }
            };
            $('#configDialog').modal('show');
        },
        copyVerification: function () {
            $scope.confirmDelete.inputVerification = $scope.confirmDelete.verification;
        }
    });
    $rootScope.$on('showDialogConfig', function(event, args) {
        $scope.showDialogConfig(args.titleDialog, args.messageDialog, args.titleClose, args.titleOk, args.functionExecute);
    });
    $rootScope.$on('hideDialogConfig', function(event, args) {
        $('#configDialog').modal('hide');
    });
}]);

function stringGen(len)
{
    var text = "";

    var charset = "!@#$%^&*abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM0123456789";

    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}