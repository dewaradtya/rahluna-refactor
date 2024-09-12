<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoicePayRequest;
use App\Http\Requests\InvoicePengurangRequest;
use App\Http\Requests\InvoiceUpdateRequest;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $invoiceJual = Invoice::with('customer')->paginate($perPage)->appends($request->query());

        return Inertia::render('Transaction/InvoiceJual/Index', compact('invoiceJual'));
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Request $request, int $id): Response|RedirectResponse
    {
        try {
            $perPage = $request->query('perPage') ?? 100;

            $invoice = Invoice::with('customer')->findOrFail($id);
            $invoiceDetail = $invoice->invoiceDetail()->with('product')->paginate($perPage)->appends($request->query());

            return Inertia::render('Transaction/InvoiceJual/Detail/Index', [
                'invoice' => $invoice,
                'invoiceDetail' => $invoiceDetail,
            ]);
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Projek tidak ditemukan');
        }
    }

    public function update(InvoiceUpdateRequest $request, int $invoiceJual): RedirectResponse
    {
        try {
            $invoiceJual = Invoice::findOrFail($invoiceJual);

            $validatedData = $request->validated();
            $validatedData['faktur_pajak'] = $this->handleTaxInvoice($request, $invoiceJual);
            $invoiceJual->update($validatedData);

            return Redirect::back()->with('success', 'Invoice berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating invoice: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah invoice Silahkan coba lagi.');
        }
    }

    public function destroy(int $invoiceJual): RedirectResponse
    {
        try {
            $invoiceJual = Invoice::findOrFail($invoiceJual);
            $invoiceJual->purchaseDetail()->delete();
            if ($invoiceJual->tax_invoice) {
                Storage::delete($invoiceJual->tax_invoice);
            }
            $invoiceJual->delete();

            return Redirect::back()->with('success', 'Purchase order berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting projects: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus purchase order. Silahkan coba lagi.');
        }
    }

    public function pay(InvoicePayRequest $request, int $invoice): RedirectResponse
    {
        try {
            $validatedData = $request->validated();

            $invoice = Invoice::findOrFail($invoice);
            $invoice->update(['total_bayar' => $invoice->total_bayar + $validatedData['total_bayar']]);
            $invoice->update(['ppn_pph_customer' => $invoice->ppn_pph_customer + $validatedData['ppn_pph_customer']]);

            return Redirect::back()->with('success', 'bayar invoice berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating stock invoice: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah bayar invoice. Silahkan coba lagi.');
        }
    }

    public function pengurangHarga(InvoicePengurangRequest $request, int $invoice): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $invoice = Invoice::findOrFail($invoice);
            $invoice->update(['pengurang_harga' => $validatedData['pengurang_harga']]);
            DB::commit();
            return Redirect::back()->with('success', 'Pengurang harga berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating Pengurang Harga invoice: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat memperbarui Pengurang Harga. Silahkan coba lagi.');
        }
    }

    private function handleTaxInvoice($request, $invoiceJual = null)
    {
        if ($request->hasFile('faktur_pajak')) {
            if ($invoiceJual && $invoiceJual->faktur_pajak) {
                Storage::delete($invoiceJual->faktur_pajak);
            }
            return $request->file('faktur_pajak')->store('invoiceJuals');
        }
        if ($invoiceJual && $invoiceJual->faktur_pajak) {
            return $invoiceJual->faktur_pajak;
        }
    }
}
