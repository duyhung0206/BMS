var elixir = require('laravel-elixir');
/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass([
        'adminhtml/general.css',
        'adminhtml/loading-bar.css',
        'adminhtml/notify.css'
    ]);

    /*adminhtml*/
    mix.scripts([
        'adminhtml/app.js',
        'adminhtml/route.js',
        'adminhtml/auth.js',
        'adminhtml/angular-loading-bar-custom.js',
    ], 'public/js/adminhtml/app.js');

    mix.scripts([
        'adminhtml/models/userModel.js',
        'adminhtml/models/seasonModel.js',
    ], 'public/js/adminhtml/models.js');


    mix.scripts([
        'adminhtml/controllers/globalController.js',
        'adminhtml/controllers/userController.js',
        'adminhtml/controllers/navController.js',
        'adminhtml/controllers/seasonController.js',
        'adminhtml/controllers/partials/confirmDeleteController.js',
        'adminhtml/controllers/partials/notifyController.js',
    ], 'public/js/adminhtml/controllers.js');

    mix.version([
        'js/adminhtml/app.js',
        'js/adminhtml/models.js',
        'js/adminhtml/controllers.js'
    ]);

});
