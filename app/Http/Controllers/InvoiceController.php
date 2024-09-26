<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoicePayRequest;
use App\Http\Requests\InvoicePengurangRequest;
use App\Http\Requests\InvoiceUpdateRequest;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\SuratJalan;
use App\Models\SuratJalanNew;
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
        $perPage = $request->query('perPage', 200);
        $currentPage = $request->query('page', 1);

        $invoiceJual = Invoice::with('customer')->paginate($perPage, ['*'], 'page', $currentPage)->appends($request->query());

        return Inertia::render('Transaction/InvoiceJual/Index', compact('invoiceJual'));
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Request $request, int $id): Response|RedirectResponse
    {
        try {
            $perPage = $request->query('perPage', 200);
            $currentPage = $request->query('page', 1);

            $invoice = Invoice::with('customer')->findOrFail($id);
            $invoiceDetail = $invoice->invoiceDetail()->with('product')->paginate($perPage, ['*'], 'page', $currentPage)->appends($request->query());
            $products = Product::all();

            return Inertia::render('Transaction/InvoiceJual/Detail/Index', [
                'invoice' => $invoice,
                'invoiceDetail' => $invoiceDetail,
                'products' => $products,
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
            $validatedData['nilai_ppn'] = $invoiceJual->totalinvoice * ($validatedData['ppn'] / 100);
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
        DB::beginTransaction();
        try {
            $invoiceJual = Invoice::findOrFail($invoiceJual);
            $invoiceJual->invoiceDetail()->delete();
            $suratJalanNewList = SuratJalanNew::where('invoice_id', $invoiceJual->id)->get();

            foreach ($suratJalanNewList as $suratJalanNew) {
                SuratJalan::where('surat_jalan_new_id', $suratJalanNew->id)->delete();

                $suratJalanNew->delete();
            }

            $invoiceJual->delete();

            DB::commit();
            return Redirect::back()->with('success', 'Invoice dan data terkait berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting invoice and related data: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus invoice dan data terkait. Silahkan coba lagi.');
        }
    }

    public function pay(InvoicePayRequest $request, int $invoice): RedirectResponse
    {
        try {
            $validatedData = $request->validated();

            $invoice = Invoice::findOrFail($invoice);
            $invoice->update($validatedData);


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
