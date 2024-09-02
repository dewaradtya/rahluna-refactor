<?php

namespace App\Http\Controllers;

use App\Http\Requests\SuratJalanNewStoreRequest;
use App\Http\Requests\SuratJalanStoreRequest;
use App\Http\Requests\SuratJalanUpdateRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductHistory;
use App\Models\SuratJalan;
use App\Models\SuratJalanNew;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class SuratJalanController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $customers = Customer::paginate($perPage)->appends($request->query());

        return Inertia::render('Transaction/SuratJalan/Index', compact('customers'));
    }

    public function store(SuratJalanStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();

            $product = Product::findOrFail($validatedData['product_id']);
            $validatedData['purchase_price'] = $product->purchase_price;
            $validatedData['price'] = $product->price;
            $validatedData['kategori'] = "Produk";
            $validatedData['surat_jalan_new_id'] = null;

            $product->stock -= $validatedData['qty'];
            $product->save();

            $existingSuratJalan = SuratJalan::where('product_id', $product->id)
                ->where('customer_id', $validatedData['customer_id'])
                ->whereNull('surat_jalan_new_id')
                ->first();

            if ($existingSuratJalan) {
                $existingSuratJalan->qty += $validatedData['qty'];
                $existingSuratJalan->save();

                $existingProductHistory = ProductHistory::where('product_id', $product->id)
                    ->where('status', 'stok terpakai')
                    ->first();

                if ($existingProductHistory) {
                    $existingProductHistory->qty += $validatedData['qty'];
                    $existingProductHistory->save();
                }
            } else {
                $suratJalan = SuratJalan::create($validatedData);

                ProductHistory::create([
                    'qty' => $validatedData['qty'],
                    'price' => $product->price,
                    'purchase_price' => $product->purchase_price,
                    'product_origin_id' => $product->id,
                    'product_id' => $product->id,
                    'status' => 'stok terpakai'
                ]);
            }

            DB::commit();
            return Redirect::back()->with('success', 'Surat Jalan berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing Surat Jalan: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah Surat Jalan. Silahkan coba lagi.');
        }
    }

    public function show(Request $request, int $id): Response|RedirectResponse
    {
        try {
            $perPage = $request->query('perPage', 100);

            $customer = Customer::findOrFail($id);
            $suratJalan = $customer->suratJalan()->with(['product', 'suratJalanNew'])->paginate($perPage)->appends($request->query());
            $products = Product::all();

            return Inertia::render('Transaction/SuratJalan/Detail/Index', [
                'suratJalan' => $suratJalan,
                'customer' => $customer,
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengambil data Surat Jalan. Silahkan coba lagi.');
        }
    }

    public function update(SuratJalanUpdateRequest $request, int $suratJalan): RedirectResponse
    {
        try {
            $suratJalan = SuratJalan::findOrFail($suratJalan);

            $validatedData = $request->validated();
            $suratJalan->update($validatedData);

            return Redirect::back()->with('success', 'Produk berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah produk. Silahkan coba lagi.');
        }
    }

    public function destroy(int $suratJalan): RedirectResponse
    {
        try {
            $suratJalan = SuratJalan::findOrFail($suratJalan);

            $product = $suratJalan->product;
            if ($product) {
                $product->stock += $suratJalan->qty;
                $product->save();
            }

            $suratJalan->delete();

            return Redirect::back()->with('success', 'Produk berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus produk. Silahkan coba lagi.');
        }
    }

    public function suratJalanNew(SuratJalanNewStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['invoice_id'] = null;

            $suratJalanNew = SuratJalanNew::create($validatedData);

            SuratJalan::whereNull('surat_jalan_new_id')
                ->where('customer_id', $suratJalanNew->customer_id)
                ->update(['surat_jalan_new_id' => $suratJalanNew->id]);

            DB::commit();
            return Redirect::back()->with('success', 'Surat Jalan Baru berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing Surat Jalan: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah Surat Jalan. Silahkan coba lagi.');
        }
    }
}
