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

            $productPackageDetail = ProductPackageDetail::create($validatedData);

            $this->updateProductPackageTotal($productPackageDetail->product_package_id);

            DB::commit();
            return Redirect::back()->with('success', 'Produk berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing product package detail: ' . $e->getMessage(), ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah produk. Silahkan coba lagi.');
        }
    }

    protected function updateProductPackageTotal($productPackageId)
    {
        $totalPurchasePrice = ProductPackageDetail::where('product_package_id', $productPackageId)
            ->sum(DB::raw('purchase_price * qty'));

        ProductPackage::where('id', $productPackageId)->update(['purchase_price' => $totalPurchasePrice]);
    }

    public function update(ProductPackageDetailUpdateRequest $request, int $productpackageDetail): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $productPackageDetail = ProductPackageDetail::findOrFail($productpackageDetail);

            $validatedData = $request->validated();
            $productPackageDetail->update($validatedData);

            $this->updateProductPackageTotal($productPackageDetail->product_package_id);

            DB::commit();
            return Redirect::back()->with('success', 'Produk berhasil diubah');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah produk. Silahkan coba lagi.');
        }
    }


    public function destroy(int $productPackageDetailId): RedirectResponse
{
    DB::beginTransaction();
    try {
        $productPackageDetail = ProductPackageDetail::findOrFail($productPackageDetailId);
        $productPackageId = $productPackageDetail->product_package_id;
        $productPackageDetail->delete();

        $this->updateProductPackageTotal($productPackageId);

        DB::commit();
        return Redirect::back()->with('success', 'Produk berhasil dihapus');
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Error deleting product: ', ['exception' => $e]);
        return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus produk. Silahkan coba lagi.');
    }
}

}
