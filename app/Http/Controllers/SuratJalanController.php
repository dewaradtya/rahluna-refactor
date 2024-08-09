<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\SuratJalan;
use Illuminate\Http\Request;
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            Log::info("Fetching data for suratJalan ID: $id");
            $suratJalan = SuratJalan::with('customers')->findOrFail($id);
            return Inertia::render('Transaction/SuratJalan/Show', [
                'suratJalan' => $suratJalan,
                'customers' => $suratJalan->customers
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing suratJalan data: ' . $e->getMessage());
            return Redirect::back()->with('error', 'Terjadi kesalahan. Silahkan coba lagi.');
        }
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
