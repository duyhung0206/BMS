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
        'adminhtml/general.css'
    ]);

    /*adminhtml*/
    mix.scripts([
        'adminhtml/app.js',
        'adminhtml/route.js',
        'adminhtml/auth.js'
    ], 'public/js/adminhtml/app.js');

    mix.scripts([
        'adminhtml/models/userModel.js',
        'adminhtml/models/categoryModel.js',
    ], 'public/js/adminhtml/models.js');


    mix.scripts([
        'adminhtml/controllers/globalController.js',
        'adminhtml/controllers/userController.js',
        'adminhtml/controllers/navController.js',
        'adminhtml/controllers/categoryController.js',
        'adminhtml/controllers/postController.js'
    ], 'public/js/adminhtml/controllers.js');

    mix.version([
        'js/adminhtml/app.js',
        'js/adminhtml/models.js',
        'js/adminhtml/controllers.js'
    ]);

});
