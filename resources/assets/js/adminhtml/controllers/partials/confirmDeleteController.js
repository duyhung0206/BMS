myApp.controller('confirmDeleteController', ['$scope', '$rootScope', function($scope, $rootScope){

    /*variables*/
    angular.extend($scope, {
        confirmDelete:{
            titleDialog: 'Modal title',
            messageDialog:'...',
            titleOk: 'OK',
            titleClose: 'Close',
            clickOk: function () {
                console.log('test');
            },
            verification: stringGen(10),
            inputVerification: ''
        }
    });
    /*functions*/
    angular.extend($scope, {
        showDialogConfig: function (titleDialog, messageDialog, titleClose, titleOk, functionExecute) {
            $scope.confirmDelete.titleDialog = titleDialog==null?'Confirm Delete':titleDialog;
            $scope.confirmDelete.messageDialog = messageDialog==null?'Enter the confirmation code !':messageDialog;
            $scope.confirmDelete.titleClose = titleClose==null?'Close':titleClose;
            $scope.confirmDelete.titleOk = titleOk==null?'Ok':titleOk;
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