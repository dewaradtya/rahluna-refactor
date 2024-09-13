<?php

namespace App\Http\Controllers;

use App\Models\InvoiceDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class InvoiceDetailController extends Controller
{
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
}
