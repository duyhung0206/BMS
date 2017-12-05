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

        Route::resource('customer', 'CustomerController');

        Route::resource('supplier', 'SupplierController');

        Route::resource('product', 'ProductController');

        Route::resource('order', 'OrderController');

        Route::resource('purchaseorder', 'PurchaseorderController');
//        Route::post('order/show/{orderId}', 'OrderController@show');
    });
});

use Illuminate\Support\Facades\Auth;
use App\Models\OrderProduct;
Route::get('test', function ()
{
    Auth::logout();
});

