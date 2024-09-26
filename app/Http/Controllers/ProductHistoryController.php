<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProductHistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage', 200);
        $currentPage = $request->query('page', 1);

        $histories = ProductHistory::with(['productOrigin', 'product'])
            ->paginate($perPage, ['*'], 'page', $currentPage)
            ->appends($request->query());

        return Inertia::render('Product/History/Index', compact('histories'));
    }

    public function show($id)
    {
        try {
            Log::info("Fetching product history for ID: $id");
            $history = ProductHistory::with('product')->findOrFail($id);
            return Inertia::render('Product/History/Show', compact('history'));
        } catch (\Exception $e) {
            Log::error('Error showing product history: ' . $e->getMessage());
            return Redirect::back()->with('error', 'Terjadi kesalahan. Silahkan coba lagi.');
        }
    }
}
