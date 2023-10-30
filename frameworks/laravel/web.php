<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// phpinfo();
// die;

Route::get('/', function () {
    return 'Ready';
});

Route::get('/info', function () {
    // Return a JSON with laravel version and app name
    return response()->json([
        'version' => app()->version(),
    ]);
});

Route::get('/db', function () {
    // Retrieve records from the customers table as JSON
    $customers = DB::table('customers')->get();
    return response()->json($customers);
});
