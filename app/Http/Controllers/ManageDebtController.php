<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\ManageDebt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ManageDebtStoreRequest;
use App\Http\Requests\ManageDebtUpdateRequest;

class ManageDebtController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $debts = ManageDebt::paginate($perPage)->appends($request->query());

        return Inertia::render('Manage/Debt/Index', compact('debts'));
    }

    public function show(Request $request, int $hutang): Response|RedirectResponse
    {
        try {
            $perPage = $request->query('perPage') ?? 100;

            $debt = ManageDebt::findOrFail($hutang);
            $debtDetails = $debt->debtDetails()->paginate($perPage)->appends($request->query());

            return Inertia::render('Manage/Debt/Detail/Index', compact('debt', 'debtDetails'));
        } catch (\Exception $e) {
            return Redirect::route('hutang.index')->with('error', 'Hutang tidak ditemukan');
        }
    }

    public function store(ManageDebtStoreRequest $request): RedirectResponse
    {
        try {
            $validatedData = $request->validated();
            $validatedData['funding'] = 'Hutang';
            $validatedData['cashflow'] = $request->cashflow ? 1 : 0;
            $validatedData['user_id'] = auth()->id();
            ManageDebt::create($validatedData);

            return Redirect::back()->with('success', 'Hutang berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error storing debt: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah hutang. Silahkan coba lagi.');
        }
    }

    public function update(ManageDebtUpdateRequest $request, int $hutang): RedirectResponse
    {
        try {
            $hutang = ManageDebt::findOrFail($hutang);

            $validatedData = $request->validated();
            $validatedData['cashflow'] = $request->cashflow ? 1 : 0;
            $hutang->update($validatedData);

            return Redirect::back()->with('success', 'Hutang berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating debt: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah hutang. Silahkan coba lagi.');
        }
    }

    public function destroy(int $hutang): RedirectResponse
    {
        try {
            $hutang = ManageDebt::findOrFail($hutang);

            $hutang->delete();

            return Redirect::back()->with('success', 'Hutang berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting debt: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus hutang. Silahkan coba lagi.');
        }
    }
}
