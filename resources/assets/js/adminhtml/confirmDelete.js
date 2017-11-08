myApp.factory('confirmDelete', ['$scope', function($scope){

    /*variables*/
    angular.extend($scope, {
        confirmDelete:{
            titleDialog: 'Modal title',
            messageDialog:'...',
            titleOk: 'OK',
            titleClose: 'Close',
            clickOk: function () {
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
            $scope.confirmDelete.clickOk = function () {
                $scope.confirmDelete.error = false;
                if(trim($scope.confirmDelete.verification) == trim($scope.confirmDelete.inputVerification)){
                    $scope.confirmDelete.error = false;
                    functionExecute();
                }else{
                    $scope.confirmDelete.error = true;
                }
            };
            $('#configDialog').modal('show');
        }
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