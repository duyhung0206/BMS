<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::group(['prefix' => 'admin'], function () {
    Route::get('/', function () {
        return view('adminhtml');
    });

    Route::post('auth', 'UserController@checkAuth');

    Route::group(['middleware' => 'auth-api'], function () {
        Route::resource('season', 'SeasonController');
        Route::post('season/delete/{seasonId}', 'SeasonController@destroy');
    });
});

use Illuminate\Support\Facades\Auth;
Route::get('test', function ()
{
    Auth::logout();
});

