myApp.controller('globalController', ['$scope', '$cookies', function($scope, $cookies){
	$scope.global = {};
	$scope.global.navUrl = 'templates/adminhtml/partials/nav.html';
}]);
myApp.controller('userController', ['$scope', 'userModel', '$location', function($scope, userModel, $location){

    /*variables*/
    angular.extend($scope, {
        login:{
            username: 'admin@example.com',
            password: 'admin'
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
                    $location.path('/dashboard');
                }
            );
        },
        doLogout: function(){
            userModel.doLogout();
            $location.path('/');
        }
    });
}]);
myApp.controller('navController', ['$scope', '$location', 'userModel', function($scope, $location, userModel){
	angular.extend($scope, {
		user: userModel.getUserObject(),
	 	navUrl: [{
            link: 'Posts',
            url: '/post',
            subMenu: [{
                link: 'All posts',
                url: '/post'
            }, {
                link: 'Add New',
                url: '/post/add'
            },{
                link: 'Categories',
                url: '/category'
            }]
        }, {
            link: 'Comments',
            url: '/comment'
        }, {
            link: 'Settings',
            url: '/setting'
        }]
	});

	angular.extend($scope, {
		doLogout: function(){
			userModel.doLogout();
			$location.path('/');
		},
        checkActiveLink: function(routeLink){
            if($location.path() == routeLink){
                return 'make-active';
            }
        }
	});

}]);
myApp.controller('categoryController', ['$scope', '$rootScope', 'categoryModel', 'data', function($scope, $rootScope, categoryModel, data){
    angular.extend($scope, {
        n_category:{
            name: '',
            description: '',
            is_active: '1',
            page_title: '',
        },
        currentPage : 1,
        pageSize_category: 10,
    });

    /*Getting all the categories*/
    if (data && data.categories != undefined) {
        data.categories.then(function(response) {
            $scope.categories = response.data;
            $scope.showCategory = true;
        });
    }

    /*functions*/
    angular.extend($scope, {
        addNewCategory: function (addCategoryForm) {
            if(addCategoryForm.$valid){
                $scope.formSubmitted = false;
                categoryModel.addNewCategory($scope.n_category)
                .then(function(response) {
                    if(response.status == 201){
                        $scope.categories.push(response.data);
                        console.log($scope.categories);
                    }
                })
                .catch(function(response) {
                    console.log(response);
                });
            }else{
                $scope.formSubmitted = true;
            }
        },
        editCategory: function (categoryId) {
            console.log(categoryId);
            console.log('editCategory');
        },
        deleteCategory: function (categoryId, categoryName) {
            data = {
                titleDialog: 'Confirm Delete Category: '+categoryName,
                messageDialog: null,
                titleClose: null,
                titleOk: null,
                functionExecute: function () {
                    categoryModel.deleteCategory(categoryId);
                }
            }
            $scope.$emit('showDialogConfig', data);
        }


    });
}]);
myApp.controller('postController', ['$scope', function($scope){
}]);
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
}]);

function stringGen(len)
{
    var text = "";

    var charset = "!@#$%^&*abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM0123456789";

    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}
//# sourceMappingURL=controllers.js.map
