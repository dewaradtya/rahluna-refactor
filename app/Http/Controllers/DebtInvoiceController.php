<?php

namespace App\Http\Controllers;

use App\Http\Requests\DebtInvoiceStoreRequest;
use App\Http\Requests\DebtInvoiceUpdateRequest;
use App\Models\DebtInvoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class DebtInvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $debtinvoices = DebtInvoice::paginate($perPage)->appends($request->query());

        return Inertia::render('Transaction/InvoiceHutang/Index', compact('debtinvoices'));
    }

    public function show(Request $request, int $piutang): Response|RedirectResponse
    {
        try {
            $perPage = $request->query('perPage') ?? 100;

            $receivable = DebtInvoice::findOrFail($piutang);
            $receivableDetails = $receivable->receivableDetails()->paginate($perPage)->appends($request->query());

            return Inertia::render('Manage/Receivable/Detail/Index', compact('receivable', 'receivableDetails'));
        } catch (\Exception $e) {
            return Redirect::route('piutang.index')->with('error', 'Piutang tidak ditemukan');
        }
    }

    public function store(DebtInvoiceStoreRequest $request): RedirectResponse
    {
        try {
            $validatedData = $request->validated();
            $validatedData['funding'] = 'Invoice Hutang';
            $validatedData['cashflow'] = $request->cashflow ? 1 : 0;
            $validatedData['user_id'] = 1;
            DebtInvoice::create($validatedData);

            return Redirect::back()->with('success', 'Invoice Hutang berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error storing receivable: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah invoice hutang. Silahkan coba lagi.');
        }
    }

    public function update(DebtInvoiceUpdateRequest $request, int $invhutang): RedirectResponse
    {
        try {
            $invhutang = DebtInvoice::findOrFail($invhutang);

            $validatedData = $request->validated();
            $validatedData['cashflow'] = $request->cashflow ? 1 : 0;
            $invhutang->update($validatedData);

            return Redirect::back()->with('success', 'Invoice Hutang berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating receivable: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah invoice hutang. Silahkan coba lagi.');
        }
    }

    public function destroy(int $invhutang): RedirectResponse
    {
        try {
            $invhutang = DebtInvoice::findOrFail($invhutang);

            $invhutang->delete();

            return Redirect::back()->with('success', 'Invoice Hutang berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting receivable: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus invoice hutang. Silahkan coba lagi.');
        }
    }
}
