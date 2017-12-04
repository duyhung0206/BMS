var myApp = angular.module('myApp', ['ngRoute', 'ngCookies', 'angularUtils.directives.dirPagination',
    'angular-loading-bar', 'ui.select', 'ui.router', 'ui-notification', 'ngAnimate']);

myApp.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);

myApp.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

myApp.directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function(val) {
                return '' + val;
            });
        }
    };
});

myApp.directive('inputCurrency', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            $element.addClass('numberInput');
            var separators = {
                'thousands' : $filter('number')(1000).substr(1,1),
                'decimal' : $filter('number')(1.1).substr(1,1)
            }
            var decimalEntered = false;
            var listener = function() {
                var value = $element.val().split(separators.thousands).join('').split(separators.decimal).join('.');
                if(decimalEntered) {
                    decimalEntered=false;
                    return;
                }
                if(value.indexOf('.')>1 && value.slice(-1)=='0') {$element.val(value); return;}
                $element.val($filter('number')(value));
            }

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.split(separators.thousands).join('').split(separators.decimal).join('.');
            })

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('number')(ngModelCtrl.$viewValue, false))
            }

            $element.bind('change', listener)
            $element.bind('keypress', function(event) {
                var key = event.which;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 0 || key == 8 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                    return
                }
                // ignore all other keys which we do not need
                if (
                    String.fromCharCode(key) != separators.thousands
                    && String.fromCharCode(key) != separators.decimal
                    && !(48 <= key&&key <= 57)
                    && String.fromCharCode(key) != '-'
                ) {
                    event.preventDefault();
                    return;
                }
                if (String.fromCharCode(key)==separators.decimal) decimalEntered=true;
                $browser.defer(listener) // Have to do this or changes don't get picked up properly
            })

            $element.bind('paste cut', function() {
                $browser.defer(listener)
            })
        }
    }
});
