<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurchaseStoreRequest;
use App\Http\Requests\PurchaseUpdateRequest;
use App\Models\Project;
use App\Models\Purchase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $purchase = Purchase::with(['customer', 'project'])->paginate($perPage)->appends($request->query());
        $project = Project::all();

        return Inertia::render('Purchase/Index', compact('purchase', 'project'));
    }

    public function store(PurchaseStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['user_id'] = 1;
            Purchase::create($validatedData);

            DB::commit();
            return Redirect::back()->with('success', 'Purchase order berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing purchase: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah purchase order. Silahkan coba lagi.');
        }
    }

    public function update(PurchaseUpdateRequest $request, int $purchase): RedirectResponse
    {
        try {
            $purchase = Purchase::findOrFail($purchase);

            $validatedData = $request->validated();
            $purchase->update($validatedData);

            return Redirect::back()->with('success', 'Purchase order berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating purchase: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah purchase order. Silahkan coba lagi.');
        }
    }

    public function destroy(int $purchase): RedirectResponse
    {
        try {
            $purchase = Purchase::findOrFail($purchase);
            $purchase->delete();

            return Redirect::back()->with('success', 'Purchase order detail berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting projects: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus purchase order detail. Silahkan coba lagi.');
        }
    }
}
