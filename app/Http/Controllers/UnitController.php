<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\UnitStoreRequest;
use App\Http\Requests\UnitUpdateRequest;
use Illuminate\Support\Facades\Redirect;

class UnitController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $units = Unit::paginate($perPage)->appends($request->query());

        return Inertia::render('Unit/Index', compact('units'));
    }

    public function store(UnitStoreRequest $request): RedirectResponse
    {
        try {
            $validatedData = $request->validated();
            $validatedData['user_id'] = 1;
            Unit::create($validatedData);

            return Redirect::back()->with('success', 'Satuan berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error storing unit: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah satuan. Silahkan coba lagi.');
        }
    }

    public function update(UnitUpdateRequest $request, int $unit): RedirectResponse
    {
        try {
            $unit = Unit::findOrFail($unit);

            $validatedData = $request->validated();
            $unit->update($validatedData);

            return Redirect::back()->with('success', 'Satuan berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating unit: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah satuan. Silahkan coba lagi.');
        }
    }

    public function destroy(int $unit): RedirectResponse
    {
        try {
            $unit = Unit::findOrFail($unit);
            $unit->delete();

            return Redirect::back()->with('success', 'Satuan berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting unit: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus satuan. Silahkan coba lagi.');
        }
    }
}
