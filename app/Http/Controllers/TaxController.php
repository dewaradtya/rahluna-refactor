<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaxController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage', 200);
        $currentPage = $request->query('page', 1);

        $invoice = Invoice::whereNotNull('ppn_pph_customer')
            ->where('ppn_pph_customer', '>', 0)
            ->paginate($perPage, ['*'], 'page', $currentPage)
            ->appends($request->query());

        return Inertia::render('Tax/Index', compact('invoice'));
    }
}
