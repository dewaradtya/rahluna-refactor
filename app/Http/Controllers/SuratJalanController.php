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
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $customers = Customer::paginate($perPage)->appends($request->query());

        return Inertia::render('Transaction/SuratJalan/Index', compact('customers'));
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SuratJalanStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            Log::info('Validated Data:', $validatedData);

            $product = Product::findOrFail($validatedData['product_id']);
            $validatedData['purchase_price'] = $product->purchase_price;
            $validatedData['price'] = $product->price;
            $validatedData['kategori'] = 0;
            $validatedData['surat_jalan_new_id'] = 0;

            $suratJalan = SuratJalan::create($validatedData);
            Log::info('Surat Jalan Created:', $suratJalan);
            
            DB::commit();
            return Redirect::back()->with('success', 'Surat Jalan berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing Surat Jalan: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah Surat Jalan. Silahkan coba lagi.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id): Response
    {
        $perPage = $request->query('perPage', 100);
        $customers = Customer::findOrFail($id);
        $suratJalan = SuratJalan::with(['product', 'surat_jalan_new'])->where('customer_id', $id)->paginate($perPage)->appends($request->query());
        $products = Product::all();

        return Inertia::render('Transaction/SuratJalan/Show', [
            'suratJalan' => $suratJalan,
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SuratJalan $suratJalan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SuratJalan $suratJalan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SuratJalan $suratJalan)
    {
        //
    }
}
