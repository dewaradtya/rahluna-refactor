<?php

namespace App\Http\Controllers;

use App\Exports\ProductExport;
use App\Http\Requests\ProductChangeStockRequest;
use App\Models\Unit;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\ProductHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Imports\ProductImport;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $products = Product::paginate($perPage)->appends($request->query());
        $units = Unit::all();

        return Inertia::render('Product/Index', compact('products', 'units'));
    }

    public function store(ProductStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['user_id'] = auth()->id();
            $product = Product::create($validatedData);

            ProductHistory::create([
                'qty' => $product->stock,
                'price' => $product->price,
                'purchase_price' => $product->purchase_price,
                'product_origin_id' => $product->id,
                'product_id' => $product->id,
                'status' => 'stok awal'
            ]);

            DB::commit();
            return Redirect::back()->with('success', 'Produk berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah produk. Silahkan coba lagi.');
        }
    }

    public function update(ProductUpdateRequest $request, int $product): RedirectResponse
    {
        try {
            $product = Product::findOrFail($product);

            $validatedData = $request->validated();
            $product->update($validatedData);

            return Redirect::back()->with('success', 'Produk berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah produk. Silahkan coba lagi.');
        }
    }

    public function destroy(int $product): RedirectResponse
    {
        try {
            $product = Product::findOrFail($product);
            $product->delete();

            return Redirect::back()->with('success', 'Produk berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus produk. Silahkan coba lagi.');
        }
    }


    public function changeStock(ProductChangeStockRequest $request): RedirectResponse
    {
        try {
            $validatedData = $request->validated();

            $product = Product::findOrFail($validatedData['product_id']);
            $product->update(['stock' => $product->stock + $validatedData['stock']]);

            ProductHistory::create([
                'qty' => $validatedData['stock'],
                'price' => $product->price,
                'purchase_price' => $product->purchase_price,
                'product_origin_id' => $product->id,
                'product_id' => $product->id,
                'status' => $validatedData['stock'] < 0 ? "kurang stok" : "tambah stok",
            ]);

            return Redirect::back()->with('success', 'Stok produk berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating stock product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah stok produk. Silahkan coba lagi.');
        }
    }

    public function downloadFormat()
    {
        return Excel::download(new ProductExport, 'Product.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        $userId = Auth::id(); // Get the currently authenticated user ID

        Excel::import(new ProductImport($userId), $request->file('file'));

        return redirect()->back()->with('success', 'Data produk berhasil diimport');
    }
}
