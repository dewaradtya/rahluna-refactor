<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceDetailUpdateRequest;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class InvoiceDetailController extends Controller
{
    public function update(InvoiceDetailUpdateRequest $request, int $invoiceDetail): RedirectResponse
    {
        try {
            $invoiceDetail = InvoiceDetail::findOrFail($invoiceDetail);

            $validatedData = $request->validated();
            $invoiceDetail->update($validatedData);

            return Redirect::back()->with('success', 'Invoice detail berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating invoice: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah invoice detail Silahkan coba lagi.');
        }
    }

    public function destroy(int $invoiceDetail): RedirectResponse
    {
        try {
            $invoiceDetail = InvoiceDetail::findOrFail($invoiceDetail);
            $invoiceDetail->delete();

            return Redirect::back()->with('success', 'Invoice detail berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting invoices: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus invoice detail. Silahkan coba lagi.');
        }
    }

    public function generatePdf($id)
    {
        try {
            $invoice = Invoice::with('customer')->findOrFail($id);
            $invoiceDetail = $invoice->invoiceDetail()->with('product')->get();
            
            $referensi = preg_replace('/[^A-Za-z0-9\-]/', '_', $invoice->referensi);
    
            $data = [
                'invoice' => $invoice,
                'invoiceDetail' => $invoiceDetail,
            ];
    
            $pdf = Pdf::loadView('invoiceJual.invoice', $data);
    
            $filename = "invoice-{$referensi}.pdf";
    
            return $pdf->stream($filename);
        } catch (\Exception $e) {
            Log::error('Error generating invoice PDF: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat membuka PDF invoice. Silahkan coba lagi.');
        }
    }

    public function kwitansi($id)
    {
        try {
            $invoice = Invoice::with('customer')->findOrFail($id);
            $invoiceDetail = $invoice->invoiceDetail()->with('product')->get();
            
    
            $data = [
                'invoice' => $invoice,
                'invoiceDetail' => $invoiceDetail,
            ];
    
            $pdf = Pdf::loadView('invoiceJual.kwitansi', $data)->setPaper('a4', 'landscape');;
    
            $filename = "kwitansi.pdf";
    
            return $pdf->stream($filename);
        } catch (\Exception $e) {
            Log::error('Error generating invoice PDF: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat membuka PDF invoice. Silahkan coba lagi.');
        }
    }
}
