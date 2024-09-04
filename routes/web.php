<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DebtInvoiceController;
use App\Http\Controllers\DebtInvoiceDetailController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ManageDebtController;
use App\Http\Controllers\OprasionalController;
use App\Http\Controllers\ManageCapitalController;
use App\Http\Controllers\ManageDebtDetailController;
use App\Http\Controllers\ManageReceivableController;
use App\Http\Controllers\ManageReceivableDetailController;
use App\Http\Controllers\ProductHistoryController;
use App\Http\Controllers\ProductPackageController;
use App\Http\Controllers\ProductPackageDetailController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SuratJalanController;
use Inertia\Inertia;

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::resource('menu', MenuController::class);
Route::resource('oprasional', OprasionalController::class);
Route::resource('modal', ManageCapitalController::class);
Route::resource('hutang', ManageDebtController::class);
Route::resource('hutang/detail', ManageDebtDetailController::class)->only(['store', 'update', 'destroy']);
Route::resource('piutang', ManageReceivableController::class)->except(['created', 'edit']);
Route::resource('piutang/detail', ManageReceivableDetailController::class)->only(['store', 'update', 'destroy']);
Route::resource('customer', CustomerController::class)->only(['index', 'store', 'update', 'destroy']);

Route::get('user', [UserController::class, 'index'])->name('user');
Route::get('user/profile', [UserController::class, 'show'])->name('user.show');

Route::get('login', [LoginController::class, 'index'])->name('login');

Route::controller(UserRoleController::class)->group(function () {
    Route::get('role', 'index')->name('role.index');
    Route::get('role/{role:slug}', 'show')->name('role.show');
    Route::post('role/change-access', 'changeAccess')->name('role.changeAccess');
});

Route::controller(UnitController::class)->group(function () {
    Route::get('units', 'index')->name('units.index');
    Route::post('units', 'store')->name('units.store');
    Route::put('units/{unit}', 'update')->name('units.update');
    Route::delete('units/{unit}', 'destroy')->name('units.destroy');
});

Route::controller(ProductController::class)->group(function () {
    Route::get('products', 'index')->name('products.index');
    Route::post('products', 'store')->name('products.store');
    Route::post('products/change-stock', 'changeStock')->name('product.change-stock');
    Route::put('products/{product}', 'update')->name('products.update');
    Route::delete('products/{product}', 'destroy')->name('products.destroy');
    Route::get('products/download-format', 'downloadFormat')->name('products.download-format');
    Route::post('products/import', 'import')->name('products.import');
});

Route::controller(SuratJalanController::class)->group(function () {
    Route::get('transaksi/suratJalan', 'index')->name('transaksi.suratJalan.index');
    Route::post('transaksi/suratJalan', 'store')->name('transaksi.suratJalan.store');
    Route::post('transaksi/suratJalan/paket', 'addPaket')->name('transaksi.suratJalan.paket');
    Route::post('transaksi/suratJalan/sjnew', 'suratJalanNew')->name('transaksi.suratJalan.suratJalanNew');
    Route::get('transaksi/suratJalan/{suratJalan}', 'show')->name('transaksi.suratJalan.show');
    Route::put('transaksi/suratJalan/{suratJalan}', 'update')->name('transaksi.suratJalan.update');
    Route::delete('transaksi/suratJalan/{suratJalan}', 'destroy')->name('transaksi.suratJalan.destroy');
});

Route::controller(ProjectController::class)->group(function () {
    Route::get('project', 'index')->name('project.index');
    Route::post('project', 'store')->name('project.store');
    Route::post('project/paket', 'addPaket')->name('project.paket');
    Route::post('project/uangMasuk', 'uangMasuk')->name('project.uangMasuk');
    Route::post('project/uangKeluar', 'uangKeluar')->name('project.uangKeluar');
    Route::get('project/{project}', 'show')->name('project.show');
    Route::put('project/{project}', 'update')->name('project.update');
    Route::delete('project/{project}', 'destroy')->name('project.destroy');
});

Route::resource('products/package', ProductPackageController::class);
Route::resource('products/package/detail', ProductPackageDetailController::class);
Route::resource('products/history', ProductHistoryController::class);
Route::resource('transaksi/invoiceJual', InvoiceController::class);
Route::resource('transaksi/invoiceHutang', DebtInvoiceController::class);
Route::resource('transaksi/invoiceHutang/detail', DebtInvoiceDetailController::class)->only(['store', 'update', 'destroy']);

Route::fallback(function () {
    return Inertia::render('NotFound/Index');
});