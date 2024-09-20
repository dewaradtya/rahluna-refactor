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
use App\Http\Controllers\ErrorController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\InvoiceDetailController;
use App\Http\Controllers\ManageDebtController;
use App\Http\Controllers\OprasionalController;
use App\Http\Controllers\ManageCapitalController;
use App\Http\Controllers\ManageDebtDetailController;
use App\Http\Controllers\ManageReceivableController;
use App\Http\Controllers\ManageReceivableDetailController;
use App\Http\Controllers\PPNController;
use App\Http\Controllers\ProductHistoryController;
use App\Http\Controllers\ProductPackageController;
use App\Http\Controllers\ProductPackageDetailController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectDetailController;
use App\Http\Controllers\ProjectDoneController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\PurchaseDetailController;
use App\Http\Controllers\SuratJalanController;
use App\Http\Controllers\TaxController;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'index'])->name('login');
    Route::post('login', [LoginController::class, 'store'])->name('doLogin');
});
Route::post('logout', [LoginController::class, 'logout'])->name('doLogout');

Route::middleware(['auth'])->group(function () {
    Route::get('user', [UserController::class, 'index'])->name('user');
    Route::get('user/profile', [UserController::class, 'show'])->name('user.show');
    Route::get('profile/edit', [UserController::class, 'edit'])->name('profile.edit');
    Route::get('user/profile/change-pin', [UserController::class, 'ChangePin'])->name('user.change_pin');
    Route::post('user/profile/change-pin', [UserController::class, 'updatePin'])->name('user.update-pin');
    Route::post('profile/update', [UserController::class, 'update'])->name('user.update');

    Route::middleware(['role:super-admin'])->group(function () {
        Route::controller(UserRoleController::class)->group(function () {
            Route::get('role', 'index')->name('role.index');
            Route::get('role/{role:slug}', 'show')->name('role.show');
            Route::post('role/change-access', 'changeAccess')->name('role.changeAccess');
        });
    });

    Route::middleware(['menu.access'])->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::resource('menu', MenuController::class);
        Route::resource('oprasional', OprasionalController::class);
        Route::resource('modal', ManageCapitalController::class);
        Route::resource('hutang', ManageDebtController::class);
        Route::resource('hutang/detail', ManageDebtDetailController::class)->only(['store', 'update', 'destroy']);
        Route::resource('piutang', ManageReceivableController::class)->except(['created', 'edit']);
        Route::resource('piutang/detail', ManageReceivableDetailController::class)->only(['store', 'update', 'destroy']);
        Route::resource('customer', CustomerController::class)->only(['index', 'store', 'update', 'destroy']);

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
            Route::post('transaksi/suratJalan', 'store')->name('transaksi.suratJalan.store');
            Route::post('transaksi/suratJalan/paket', 'addPaket')->name('transaksi.suratJalan.paket');
            Route::post('transaksi/suratJalan/sjnew', 'suratJalanNew')->name('transaksi.suratJalan.suratJalanNew');
            Route::post('transaksi/suratJalan/invoice', 'sjNewInvoice')->name('transaksi.suratJalan.invoice');
            Route::get('transaksi/suratJalan/{suratJalan}', 'show')->name('transaksi.suratJalan.show');
            Route::put('transaksi/suratJalan/{suratJalan}', 'update')->name('transaksi.suratJalan.update');
            Route::delete('transaksi/suratJalan/{suratJalan}', 'destroy')->name('transaksi.suratJalan.destroy');
        });

        Route::controller(ProjectController::class)->group(function () {
            Route::get('project', 'index')->name('project.index');
            Route::post('project', 'store')->name('project.store');
            Route::post('/project/{project}/complete', 'complete')->name('project.complete');
            Route::get('/projects/export', 'exportExcel')->name('project.export');
            Route::get('project/{project}', 'show')->name('project.show');
            Route::put('project/{project}', 'update')->name('project.update');
            Route::delete('project/{project}', 'destroy')->name('project.destroy');
        });

        Route::controller(ProjectDetailController::class)->group(function () {
            Route::post('project/detail/uangMasuk', 'uangMasuk')->name('project.detail.uangMasuk');
            Route::post('project/detail/uangKeluar', 'uangKeluar')->name('project.detail.uangKeluar');
            Route::put('project/detail/{project}', 'update')->name('project.detail.update');
            Route::delete('project/detail/{detail}', 'destroy')->name('project.detail.destroy');
            Route::get('project/detail/{projectId}/download-format', 'downloadFormat')->name('project.detail.download-format');
            Route::post('project/detail/import', 'import')->name('project.detail.import');
        });

        Route::controller(PurchaseController::class)->group(function () {
            Route::get('purchase', 'index')->name('purchase.index');
            Route::post('purchase', 'store')->name('purchase.store');
            Route::get('/purchase/{purchase}/pdf', 'generatePdf')->name('purchase.generatePdf');
            Route::get('purchase/{purchase}', 'show')->name('purchase.show');
            Route::put('purchase/{purchase}', 'update')->name('purchase.update');
            Route::delete('purchase/{purchase}', 'destroy')->name('purchase.destroy');
        });

        Route::controller(ProjectDoneController::class)->group(function () {
            Route::get('projects/done', 'index')->name('projects.done.index');
            Route::post('projects/done', 'store')->name('projects.done.store');
            Route::get('/projects/done/export', 'exportExcel')->name('projects.done.export');
            Route::get('projects/done/{project}', 'show')->name('projects.done.show');
            Route::put('projects/done/{project}', 'update')->name('projects.done.update');
            Route::delete('projects/done/{project}', 'destroy')->name('projects.done.destroy');
        });

        Route::controller(InvoiceController::class)->group(function () {
            Route::get('transaksi/invoiceJual', 'index')->name('transaksi.invoiceJual.index');
            Route::post('transaksi/invoiceJual', 'store')->name('transaksi.invoiceJual.store');
            Route::post('transaksi/invoiceJual/pay/{invoiceJual}', 'pay')->name('transaksi.invoiceJual.pay');
            Route::post('transaksi/invoiceJual/pengurang/{invoiceJual}', 'pengurangHarga')->name('transaksi.invoiceJual.pengurangHarga');
            Route::get('transaksi/invoiceJual/{invoiceJual}', 'show')->name('transaksi.invoiceJual.show');
            Route::put('transaksi/invoiceJual/{invoiceJual}', 'update')->name('transaksi.invoiceJual.update');
            Route::delete('transaksi/invoiceJual/{invoiceJual}', 'destroy')->name('transaksi.invoiceJual.destroy');
        });

        Route::controller(InvoiceDetailController::class)->group(function () {
            Route::put('transaksi/invoiceJual/detail/{invoiceJual}', 'update')->name('transaksi.invoiceJual.detail.update');
            Route::delete('transaksi/invoiceJual/detail/{invoiceJual}', 'destroy')->name('transaksi.invoiceJual.detail.destroy');
            Route::get('transaksi/invoiceJual/detail/{purchase}/pdf', 'generatePdf')->name('transaksi.invoiceJual.detail.generatePdf');
            Route::get('transaksi/invoiceJual/detail/{purchase}/kwitansi', 'kwitansi')->name('transaksi.invoiceJual.detail.kwitansi');
        });

        Route::resource('purchase/detail', PurchaseDetailController::class);
        Route::resource('taxes', TaxController::class);
        Route::resource('tax/ppn', PPNController::class);
        Route::resource('products/package', ProductPackageController::class);
        Route::resource('products/package/detail', ProductPackageDetailController::class);
        Route::resource('products/history', ProductHistoryController::class);
        Route::resource('transaksi/invoiceHutang', DebtInvoiceController::class);
        Route::resource('transaksi/invoiceHutang/detail', DebtInvoiceDetailController::class)->only(['store', 'update', 'destroy']);
    });
});
Route::fallback(function () {
    return Inertia::render('Error/NotFound');
});

Route::get('/403', [ErrorController::class, 'forbidden'])->name('error.403');
Route::get('/404', [ErrorController::class, 'notFound'])->name('error.404');
