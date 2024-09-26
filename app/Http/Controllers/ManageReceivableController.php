<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Models\ManageReceivable;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ManageReceivableStoreRequest;
use App\Http\Requests\ManageReceivableUpdateRequest;

class ManageReceivableController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage', 200);
        $currentPage = $request->query('page', 1);

        $receivables = ManageReceivable::paginate($perPage, ['*'], 'page', $currentPage)->appends($request->query());

        return Inertia::render('Manage/Receivable/Index', compact('receivables'));
    }

    public function show(Request $request, int $piutang): Response|RedirectResponse
    {
        try {
            $perPage = $request->query('perPage', 200);
        $currentPage = $request->query('page', 1);

            $receivable = ManageReceivable::findOrFail($piutang);
            $receivableDetails = $receivable->receivableDetails()->paginate($perPage, ['*'], 'page', $currentPage)->appends($request->query());

            return Inertia::render('Manage/Receivable/Detail/Index', compact('receivable', 'receivableDetails'));
        } catch (\Exception $e) {
            return Redirect::route('piutang.index')->with('error', 'Piutang tidak ditemukan');
        }
    }

    public function store(ManageReceivableStoreRequest $request): RedirectResponse
    {
        try {
            $validatedData = $request->validated();
            $validatedData['funding'] = 'Piutang';
            $validatedData['cashflow'] = $request->cashflow ? 1 : 0;
            $validatedData['user_id'] = auth()->id();
            ManageReceivable::create($validatedData);

            return Redirect::back()->with('success', 'Piutang berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error storing receivable: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah piutang. Silahkan coba lagi.');
        }
    }

    public function update(ManageReceivableUpdateRequest $request, int $piutang): RedirectResponse
    {
        try {
            $piutang = ManageReceivable::findOrFail($piutang);

            $validatedData = $request->validated();
            $validatedData['cashflow'] = $request->cashflow ? 1 : 0;
            $piutang->update($validatedData);

            return Redirect::back()->with('success', 'Piutang berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating receivable: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah piutang. Silahkan coba lagi.');
        }
    }

    public function destroy(int $piutang): RedirectResponse
    {
        try {
            $piutang = ManageReceivable::findOrFail($piutang);

            $piutang->delete();

            return Redirect::back()->with('success', 'Piutang berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting receivable: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus piutang. Silahkan coba lagi.');
        }
    }
}
