<?php

namespace App\Http\Controllers;

use App\Http\Requests\SjNewInvoiceRequest;
use App\Http\Requests\SuratJalanNewStoreRequest;
use App\Http\Requests\SuratJalanStoreRequest;
use App\Http\Requests\SuratJalanUpdateRequest;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\Product;
use App\Models\ProductHistory;
use App\Models\ProductPackage;
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
        $perPage = $request->query('perPage', 200);
        $currentPage = $request->query('page', 1);

        $customers = Customer::paginate($perPage, ['*'], 'page', $currentPage)->appends($request->query());

        return Inertia::render('Transaction/SuratJalan/Index', compact('customers'));
    }

    public function store(SuratJalanStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();

            $product = Product::findOrFail($validatedData['product_id']);

            if ($product->stock < $validatedData['qty']) {
                return redirect()->back()->withErrors('Stok produk tidak mencukupi.');
            }

            $validatedData['purchase_price'] = $product->purchase_price;
            $validatedData['price'] = $product->price;
            $validatedData['kategori'] = "Produk";
            $validatedData['surat_jalan_new_id'] = null;

            $product->stock -= $validatedData['qty'];
            $product->save();

            $existingSuratJalan = SuratJalan::where('product_id', $product->id)
                ->where('customer_id', $validatedData['customer_id'])
                ->where('kategori', 'Produk')
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
                } else {
                    ProductHistory::create([
                        'qty' => $validatedData['qty'],
                        'price' => $product->price,
                        'purchase_price' => $product->purchase_price,
                        'product_origin_id' => $product->id,
                        'product_id' => $product->id,
                        'kategori' => $validatedData['kategori'],
                        'status' => 'stok terpakai',
                    ]);
                }
            } else {
                SuratJalan::create($validatedData);

                ProductHistory::create([
                    'qty' => $validatedData['qty'],
                    'price' => $product->price,
                    'purchase_price' => $product->purchase_price,
                    'product_origin_id' => $product->id,
                    'product_id' => $product->id,
                    'kategori' => $validatedData['kategori'],
                    'status' => 'stok terpakai',
                ]);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Produk berhasil ditambahkan ke Surat Jalan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors('Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function show(Request $request, int $id): Response|RedirectResponse
    {
        try {
            $perPage = $request->query('perPage', 200);
            $currentPage = $request->query('page', 1);

            $customer = Customer::findOrFail($id);
            $suratJalan = $customer->suratJalan()
                ->whereNull('surat_jalan_new_id')
                ->with(['product', 'suratJalanNew', 'productPackage'])
                ->paginate($perPage, ['*'], 'page', $currentPage)
                ->appends($request->query());

            $suratJalanNew = SuratJalanNew::where('customer_id', $id)->paginate($perPage, ['*'], 'page', $currentPage);
            $productPackages = ProductPackage::all();

            $products = Product::all();

            return Inertia::render('Transaction/SuratJalan/Detail/Index', [
                'suratJalan' => $suratJalan,
                'suratJalanNew' => $suratJalanNew,
                'customer' => $customer,
                'products' => $products,
                'productPackages' => $productPackages
            ]);
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengambil data Surat Jalan. Silahkan coba lagi.');
        }
    }

    public function addPaket(SuratJalanStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();

            $productPackage = ProductPackage::findOrFail($validatedData['product_id']);
            $validatedData['purchase_price'] = $productPackage->purchase_price;
            $validatedData['price'] = $productPackage->price;
            $validatedData['kategori'] = "Paket";
            $validatedData['surat_jalan_new_id'] = null;

            foreach ($productPackage->productPackageDetails as $detail) {
                $product = Product::findOrFail($detail->product_id);
                $product->stock -= ($detail->qty * $validatedData['qty']);
                $product->save();

                ProductHistory::create([
                    'qty' => $detail->qty * $validatedData['qty'],
                    'price' => $product->price,
                    'purchase_price' => $product->purchase_price,
                    'product_origin_id' => $product->id,
                    'product_id' => $product->id,
                    'kategori' => $validatedData['kategori'],
                    'status' => 'stok terpakai',
                ]);
            }

            $existingSuratJalan = SuratJalan::where('product_id', $productPackage->id)
                ->where('customer_id', $validatedData['customer_id'])
                ->where('kategori', 'Paket')
                ->whereNull('surat_jalan_new_id')
                ->first();

            if ($existingSuratJalan) {
                $existingSuratJalan->qty += $validatedData['qty'];
                $existingSuratJalan->save();
            } else {
                SuratJalan::create($validatedData);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Paket berhasil ditambahkan ke Surat Jalan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors('Terjadi kesalahan: ' . $e->getMessage());
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

            if ($suratJalan->kategori === 'Produk') {
                $product = $suratJalan->product;
                if ($product) {
                    $product->stock += $suratJalan->qty;
                    $product->save();
                }
            } elseif ($suratJalan->kategori === 'Paket') {
                $packageDetails = $suratJalan->productPackage->productPackageDetails;
                foreach ($packageDetails as $detail) {
                    $product = $detail->product;
                    if ($product) {
                        $product->stock += $detail->qty * $suratJalan->qty;
                        $product->save();
                    }
                }
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

            $selectedRows = $request->input('selected_rows', []);

            if (!empty($selectedRows)) {
                SuratJalan::whereIn('id', $selectedRows)
                    ->where('customer_id', $suratJalanNew->customer_id)
                    ->update(['surat_jalan_new_id' => $suratJalanNew->id]);
            }

            DB::commit();
            return Redirect::back()->with('success', 'Surat Jalan Baru berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing Surat Jalan: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah Surat Jalan. Silahkan coba lagi.');
        }
    }

    public function sjNewInvoice(SjNewInvoiceRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['user_id'] = auth()->id();

            $invoice = Invoice::create($validatedData);

            $selectedIds = $request->input('selected_surat_jalan_new_rows');
            $suratJalanNewList = SuratJalanNew::whereIn('id', $selectedIds)
                ->whereNull('invoice_id')
                ->where('customer_id', $invoice->customer_id)
                ->get();

            $totalNilai = 0;

            foreach ($suratJalanNewList as $suratJalanNew) {
                $suratJalanDetails = SuratJalan::where('surat_jalan_new_id', $suratJalanNew->id)->get();

                foreach ($suratJalanDetails as $detail) {
                    if ($detail->kategori === "Paket") {
                        $productPackage = ProductPackage::findOrFail($detail->product_id);

                        foreach ($productPackage->productPackageDetails as $packageDetail) {
                            $totalNilai += $packageDetail->product->price * ($packageDetail->qty * $detail->qty);

                            InvoiceDetail::create([
                                'invoice_id'     => $invoice->id,
                                'product_id'     => $packageDetail->product_id,
                                'qty'            => $packageDetail->qty * $detail->qty,
                                'price'          => $packageDetail->product->price,
                                'purchase_price' => $packageDetail->product->purchase_price,
                                'note'           => $detail->note,
                                'kategori'       => $detail->kategori,
                            ]);
                        }
                    } else {
                        $totalNilai += $detail->price * $detail->qty;

                        InvoiceDetail::create([
                            'invoice_id'     => $invoice->id,
                            'product_id'     => $detail->product_id,
                            'qty'            => $detail->qty,
                            'price'          => $detail->price,
                            'purchase_price' => $detail->purchase_price,
                            'note'           => $detail->note,
                            'kategori'       => $detail->kategori,
                        ]);
                    }
                }

                $suratJalanNew->update(['invoice_id' => $invoice->id]);
            }

            $invoice->update(['total_nilai' => $totalNilai]);

            DB::commit();
            return Redirect::back()->with('success', 'Invoice Baru berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing invoice: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah invoice. Silahkan coba lagi.');
        }
    }
}
