<?php

namespace App\Http\Controllers;

use App\Models\ManageDebtDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ManageDebtDetailStoreRequest;
use App\Http\Requests\ManageDebtDetailUpdateRequest;

class ManageDebtDetailController extends Controller
{
    public function store(ManageDebtDetailStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['proof'] = $this->handleProof($request);
            $validatedData['user_id'] = 1;
            $debtDetail = ManageDebtDetail::create($validatedData);

            $this->updateTotalPayment($debtDetail->debt, $request->amount);

            DB::commit();
            return Redirect::back()->with('success', 'Bayar hutang berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing debt detail: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah bayar hutang. Silahkan coba lagi.');
        }
    }

    public function update(ManageDebtDetailUpdateRequest $request, int $detail): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $debtDetail = ManageDebtDetail::findOrFail($detail);
            $oldAmount = $debtDetail->amount;

            $validatedData = $request->validated();
            $validatedData['proof'] = $this->handleProof($request, $debtDetail);
            $debtDetail->update($validatedData);

            $this->updateTotalPayment($debtDetail->debt, $request->amount, $oldAmount);

            DB::commit();
            return Redirect::back()->with('success', 'Bayar hutang berhasil diubah');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating debt detail: ', ['exception' => $e]);
            return Redirect::back()->with('error', "Terjadi kesalahan saat mengubah bayar hutang. Silahkan coba lagi.");
        }
    }

    public function destroy(int $detail): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $debtDetail = ManageDebtDetail::findOrFail($detail);

            $this->updateTotalPayment($debtDetail->debt, 0, $debtDetail->amount);

            if ($debtDetail->proof) {
                Storage::delete($debtDetail->proof);
            }
            $debtDetail->delete();

            DB::commit();
            return Redirect::back()->with('success', 'Bayar hutang berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error deleting debt detail: ', ['exception' => $e]);
            return Redirect::back()->with('error', "Terjadi kesalahan saat menghapus bayar hutang. Silahkan coba lagi.");
        }
    }

    private function handleProof($request, $debtDetail = null)
    {
        if ($request->hasFile('proof')) {
            if ($debtDetail && $debtDetail->proof) {
                Storage::delete($debtDetail->proof);
            }
            return $request->file('proof')->store('manage-debts');
        }
        if ($debtDetail && $debtDetail->proof) {
            return $debtDetail->proof;
        }
    }

    private function updateTotalPayment($debt, $amount, $oldAmount = 0)
    {
        $debt->total_payment = ($debt->total_payment - $oldAmount) + $amount;
        $debt->save();
    }
}
