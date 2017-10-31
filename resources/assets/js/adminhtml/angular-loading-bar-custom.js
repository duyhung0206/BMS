myApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    // cfpLoadingBarProvider.spinnerTemplate = '<div class="over-load"></div><div class="cssload-thecube"><div class="cssload-cube cssload-c1"></div><div class="cssload-cube cssload-c2"></div><div class="cssload-cube cssload-c4"></div><div class="cssload-cube cssload-c3"></div></div>';
    cfpLoadingBarProvider.spinnerTemplate = '<div class="over-load"></div><div class="loader"></div>';
}])
