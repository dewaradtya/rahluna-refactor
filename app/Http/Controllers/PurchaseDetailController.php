<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurchaseDetailStoreRequest;
use App\Http\Requests\PurchaseDetailUpdateRequest;
use App\Models\Purchase;
use App\Models\PurchaseDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class PurchaseDetailController extends Controller
{
    public function store(PurchaseDetailStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['date'] = $validatedData['date'] ?? now();

            $purchaseDetail = PurchaseDetail::create($validatedData);

            $this->updatePurchaseTotal($purchaseDetail->purchase_id);

            DB::commit();
            return Redirect::back()->with('success', 'Detail purchase order berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing purchase: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah purchase order detail. Silahkan coba lagi.');
        }
    }

    protected function updatePurchaseTotal($purchaseId)
    {
        $total = PurchaseDetail::where('purchase_id', $purchaseId)
            ->sum(DB::raw('amount * qty'));

        Purchase::where('id', $purchaseId)->update(['total_value' => $total]);
    }

    public function update(PurchaseDetailUpdateRequest $request, int $purchaseDetail): RedirectResponse
    {
        try {
            $purchaseDetail = PurchaseDetail::findOrFail($purchaseDetail);

            $validatedData = $request->validated();
            $purchaseDetail->update($validatedData);

            return Redirect::back()->with('success', 'Purchase order detail berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating purchase: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah purchase order detail. Silahkan coba lagi.');
        }
    }

    public function destroy(int $purchaseDetail): RedirectResponse
    {
        try {
            $purchaseDetail = PurchaseDetail::findOrFail($purchaseDetail);
            $purchaseDetail->delete();

            return Redirect::back()->with('success', 'Purchase order detail berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting projects: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus purchase order detail. Silahkan coba lagi.');
        }
    }
}
