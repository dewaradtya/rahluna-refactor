<?php

namespace App\Http\Controllers;

use App\Http\Requests\PPNUpdateRequest;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PPNController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage', 200);
        $currentPage = $request->query('page', 1);

        $invoice = Invoice::whereNotNull('ppn_pph_customer')
            ->where('ppn_pph_customer', '>', 0)
            ->paginate($perPage, ['*'], 'page', $currentPage)
            ->appends($request->query());

        return Inertia::render('Tax/PPN/Index', compact('invoice'));
    }

    public function update(PPNUpdateRequest $request, int $invoice): RedirectResponse
    {
        try {
            $invoice = Invoice::findOrFail($invoice);

            $validatedData = $request->validated();
            $validatedData['bukti_customer'] = $this->handleBuktiInvoice($request, $invoice);
            $invoice->update($validatedData);

            return Redirect::back()->with('success', 'Data Potongan PPN dan PPH berhasil diupdate');
        } catch (\Exception $e) {
            Log::error('Error updating invoice: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah Potongan PPN dan PPH. Silahkan coba lagi.');
        }
    }

    private function handleBuktiInvoice($request, $invoice = null)
    {
        if ($request->hasFile('bukti_customer')) {
            if ($invoice && $invoice->bukti_customer) {
                Storage::disk('public')->delete($invoice->bukti_customer);
            }
            return $request->file('bukti_customer')->store('invoices', 'public');
        }
        if ($invoice && $invoice->bukti_customer) {
            return $invoice->bukti_customer;
        }
    }
}
