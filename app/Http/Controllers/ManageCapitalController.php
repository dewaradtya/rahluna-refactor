<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Models\ManageCapital;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ManageCapitalStoreRequest;
use App\Http\Requests\ManageCapitalUpdateRequest;

class ManageCapitalController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $capitals = ManageCapital::paginate($perPage)->appends($request->query());

        return Inertia::render('Manage/Capital/Index', compact('capitals'));
    }

    public function store(ManageCapitalStoreRequest $request): RedirectResponse
    {
        try {
            $validatedData = $request->validated();
            $validatedData['funding'] = 'Modal';
            $validatedData['cashflow'] = $request->cashflow ? 1 : 0;
            $validatedData['user_id'] = auth()->id();

            ManageCapital::create($validatedData);

            return Redirect::back()->with('success', 'Modal berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error storing capital: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah modal. Silahkan coba lagi.');
        }
    }

    public function update(ManageCapitalUpdateRequest $request, int $modal)
    {
        try {
            $modal = ManageCapital::findOrFail($modal);

            $validatedData = $request->validated();
            $validatedData['cashflow'] = $request->cashflow ? 1 : 0;
            $modal->update($validatedData);

            return Redirect::back()->with('success', 'Modal berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating capital: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah modal. Silahkan coba lagi.');
        }
    }

    public function destroy(int $modal)
    {
        try {
            $modal = ManageCapital::findOrFail($modal);
            $modal->delete();

            return Redirect::back()->with('success', 'Modal berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting capital: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus modal. Silahkan coba lagi.');
        }
    }
}
