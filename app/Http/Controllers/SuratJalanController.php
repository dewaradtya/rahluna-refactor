<?php

namespace App\Http\Controllers;

use App\Http\Requests\SuratJalanStoreRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\SuratJalan;
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
            $validatedData['kategori'] = 0;
            $validatedData['surat_jalan_new_id'] = 0;

            SuratJalan::create($validatedData);

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
            $suratJalan = $customer->suratJalan()->with(['product', 'surat_jalan_new'])->paginate($perPage)->appends($request->query());
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

    public function update(Request $request, SuratJalan $suratJalan)
    {
        //
    }

    public function destroy(SuratJalan $suratJalan)
    {
        //
    }
}
