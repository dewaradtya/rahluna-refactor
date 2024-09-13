<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use App\Models\ManageReceivableDetail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ManageReceivableDetailStoreRequest;
use App\Http\Requests\ManageReceivableDetailUpdateRequest;

class ManageReceivableDetailController extends Controller
{
    public function store(ManageReceivableDetailStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['proof'] = $this->handleProof($request);
            $validatedData['user_id'] = 1;
            $receivableDetail = ManageReceivableDetail::create($validatedData);

            $this->updateTotalPayment($receivableDetail->receivable, $request->amount);

            DB::commit();
            return Redirect::back()->with('success', 'Bayar piutang berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing receivable detail: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah bayar piutang. Silahkan coba lagi.');
        }
    }

    public function update(ManageReceivableDetailUpdateRequest $request, int $detail): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $receivableDetail = ManageReceivableDetail::findOrFail($detail);
            $oldAmount = $receivableDetail->amount;

            $validatedData = $request->validated();
            $validatedData['proof'] = $this->handleProof($request, $receivableDetail);
            $receivableDetail->update($validatedData);

            $this->updateTotalPayment($receivableDetail->receivable, $request->amount, $oldAmount);

            DB::commit();
            return Redirect::back()->with('success', 'Bayar piutang berhasil diubah');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating receivable detail: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah bayar piutang. Silahkan coba lagi.');
        }
    }

    public function destroy(int $detail): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $receivableDetail = ManageReceivableDetail::findOrFail($detail);

            $this->updateTotalPayment($receivableDetail->receivable, 0, $receivableDetail->amount);

            if ($receivableDetail->proof) {
                Storage::delete($receivableDetail->proof);
            }
            $receivableDetail->delete();

            DB::commit();
            return Redirect::back()->with('success', 'Bayar piutang berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting receivable detail: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus bayar piutang. Silahkan coba lagi.');
        }
    }

    private function handleProof($request, $receivableDetail = null)
    {
        if ($request->hasFile('proof')) {
            if ($receivableDetail && $receivableDetail->proof) {
                Storage::disk('public')->delete($receivableDetail->proof);
            }
            return $request->file('proof')->store('manage-receivables', 'public');
        }
        if ($receivableDetail && $receivableDetail->proof) {
            return $receivableDetail->proof;
        }
    }

    private function updateTotalPayment($receivable, $amount, $oldAmount = 0)
    {
        $receivable->total_payment = ($receivable->total_payment - $oldAmount) + $amount;
        $receivable->save();
    }
}
