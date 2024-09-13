<?php

namespace App\Http\Controllers;

use App\Http\Requests\DebtInvoiceDetailStoreRequest;
use App\Http\Requests\DebtInvoiceDetailUpdateRequest;
use App\Models\DebtInvoiceDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class DebtInvoiceDetailController extends Controller
{
    public function store(DebtInvoiceDetailStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['proof'] = $this->handleProof($request);
            $validatedData['user_id'] = 1;
            $debtInvoiceDetail = DebtInvoiceDetail::create($validatedData);

            $this->updateTotalPayment($debtInvoiceDetail->debtInvoice, $request->amount);

            DB::commit();
            return Redirect::back()->with('success', 'Bayar piutang berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing debtInvoice detail: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah bayar piutang. Silahkan coba lagi.');
        }
    }

    public function update(DebtInvoiceDetailUpdateRequest $request, int $detail): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $debtInvoiceDetail = DebtInvoiceDetail::findOrFail($detail);
            $oldAmount = $debtInvoiceDetail->amount;

            $validatedData = $request->validated();
            $validatedData['proof'] = $this->handleProof($request, $debtInvoiceDetail);
            $debtInvoiceDetail->update($validatedData);

            $this->updateTotalPayment($debtInvoiceDetail->debtInvoice, $request->amount, $oldAmount);

            DB::commit();
            return Redirect::back()->with('success', 'Bayar piutang berhasil diubah');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating debtInvoice detail: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah bayar piutang. Silahkan coba lagi.');
        }
    }

    public function destroy(int $detail): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $debtInvoiceDetail = DebtInvoiceDetail::findOrFail($detail);

            $this->updateTotalPayment($debtInvoiceDetail->debtInvoice, 0, $debtInvoiceDetail->amount);

            if ($debtInvoiceDetail->proof) {
                Storage::delete($debtInvoiceDetail->proof);
            }
            $debtInvoiceDetail->delete();

            DB::commit();
            return Redirect::back()->with('success', 'Bayar piutang berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting debtInvoice detail: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus bayar piutang. Silahkan coba lagi.');
        }
    }

    private function handleProof($request, $debtInvoiceDetail = null)
    {
        if ($request->hasFile('proof')) {
            if ($debtInvoiceDetail && $debtInvoiceDetail->proof) {
                Storage::disk('public')->delete($debtInvoiceDetail->proof);
            }
            return $request->file('proof')->store('manage-debtInvoices', 'public');
        }
        if ($debtInvoiceDetail && $debtInvoiceDetail->proof) {
            return $debtInvoiceDetail->proof;
        }
    }

    private function updateTotalPayment($debtInvoice, $amount, $oldAmount = 0)
    {
        $debtInvoice->total_payment = ($debtInvoice->total_payment - $oldAmount) + $amount;
        $debtInvoice->save();
    }
}
