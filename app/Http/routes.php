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

        Route::resource('customer', 'CustomerController');
        Route::post('customer/delete/{customerId}', 'CustomerController@destroy');

        Route::resource('supplier', 'SupplierController');
        Route::post('supplier/delete/{supplierId}', 'SupplierController@destroy');

        Route::resource('product', 'ProductController');
        Route::post('product/delete/{productId}', 'ProductController@destroy');

        Route::resource('order', 'OrderController');
        Route::post('order/delete/{orderId}', 'OrderController@destroy');
    });
});

use Illuminate\Support\Facades\Auth;
Route::get('test', function ()
{
    Auth::logout();
});

