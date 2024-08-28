<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductPackageStoreRequest;
use App\Http\Requests\ProductPackageUpdateRequest;
use App\Models\Product;
use App\Models\ProductPackage;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProductPackageController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $productPackages = ProductPackage::paginate($perPage)->appends($request->query());
        $units = Unit::all();

        return Inertia::render('Product/Package/Index', compact('productPackages', 'units'));
    }

    public function store(ProductPackageStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['user_id'] = 1;
            $productPackage = ProductPackage::create($validatedData);

            DB::commit();
            return Redirect::back()->with('success', 'Paket berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah paket. Silahkan coba lagi.');
        }
    }

    public function show(Request $request, int $id): Response|RedirectResponse
    {
        try {
            $perPage = $request->query('perPage') ?? 100;

            $productPackage = ProductPackage::findOrFail($id);
            $productPackageDetail = $productPackage->productPackageDetails()->with('product')->paginate($perPage)->appends($request->query());
            $products = Product::all();

            return Inertia::render('Product/Package/Detail/Index', [
                'productPackage' => $productPackage,
                'productPackageDetail' => $productPackageDetail,
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Paket produk tidak ditemukan');
        }
    }

    public function update(ProductPackageUpdateRequest $request, int $productpackage): RedirectResponse
    {
        try {
            $productPackage = ProductPackage::findOrFail($productpackage);

            $validatedData = $request->validated();
            $productPackage->update($validatedData);

            return Redirect::back()->with('success', 'Paket berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah paket. Silahkan coba lagi.');
        }
    }

    public function destroy(int $productpackage): RedirectResponse
    {
        try {
            $productPackage = ProductPackage::findOrFail($productpackage);
            $productPackage->delete();

            return Redirect::back()->with('success', 'Paket berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus paket. Silahkan coba lagi.');
        }
    }
}
