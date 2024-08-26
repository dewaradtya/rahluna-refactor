<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductPackageDetailStoreRequest;
use App\Http\Requests\ProductPackageDetailUpdateRequest;
use App\Models\Product;
use App\Models\ProductPackage;
use App\Models\ProductPackageDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProductPackageDetailController extends Controller
{
    public function store(ProductPackageDetailStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();

            $product = Product::findOrFail($validatedData['product_id']);
            $validatedData['purchase_price'] = $product->purchase_price;
            $validatedData['price'] = $product->price;

            ProductPackageDetail::create($validatedData);

            DB::commit();
            return Redirect::back()->with('success', 'Produk berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing product package detail: ' . $e->getMessage(), ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah produk. Silahkan coba lagi.');
        }
    }

    public function show(Request $request, $id): Response
    {
        $perPage = $request->query('perPage', 100);

        $productPackage = ProductPackage::findOrFail($id);

        $productPackageDetail = ProductPackageDetail::with('product')->where('product_package_id', $id)->paginate($perPage)->appends($request->query());

        $products = Product::all();

        return Inertia::render('Product/Package/Detail/Index', [
            'productPackage' => $productPackage,
            'productPackageDetail' => $productPackageDetail,
            'products' => $products,
        ]);
    }

    public function update(ProductPackageDetailUpdateRequest $request, int $productpackageDetail): RedirectResponse
    {
        try {
            $productPackageDetail = ProductPackageDetail::findOrFail($productpackageDetail);

            $validatedData = $request->validated();
            $productPackageDetail->update($validatedData);

            return Redirect::back()->with('success', 'Produk berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah produk. Silahkan coba lagi.');
        }
    }

    public function destroy(int $productpackageDetail): RedirectResponse
    {
        try {
            $productPackageDetail = ProductPackageDetail::findOrFail($productpackageDetail);
            $productPackageDetail->delete();

            return Redirect::back()->with('success', 'Produk berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus produk. Silahkan coba lagi.');
        }
    }
}
