<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Oprasional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response as InertiaResponse;
use App\Http\Requests\OprasionalStoreRequest;
use App\Http\Requests\OprasionalUpdateRequest;

class OprasionalController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $perPage = $request->query('perPage') ?? 100;

        $oprasionals = Oprasional::with(['tax'])->paginate($perPage)->appends($request->query());
        return Inertia::render('Oprasional/Index', compact('oprasionals'));
    }

    public function store(OprasionalStoreRequest $request): RedirectResponse
    {
        try {
            $validatedData = $request->validated();
            $validatedData['proof'] = $this->handleProof($request);
            $validatedData['user_id'] = 1;
            Oprasional::create($validatedData);

            return Redirect::back()->with('success', 'Oprasional berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error storing oprasional: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah oprasional. Silahkan coba lagi.');
        }
    }

    public function update(OprasionalUpdateRequest $request, int $oprasional)
    {
        try {
            $oprasional = Oprasional::findOrFail($oprasional);

            $validatedData = $request->validated();
            $validatedData['proof'] = $this->handleProof($request, $oprasional);
            $oprasional->update($validatedData);

            return Redirect::back()->with('success', 'Oprasional berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating oprasional: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah oprasional. Silahkan coba lagi.');
        }
    }

    public function destroy(int $oprasional)
    {
        try {
            $oprasional = Oprasional::findOrFail($oprasional);

            if ($oprasional->proof) {
                Storage::delete($oprasional->proof);
            }
            $oprasional->delete();

            return Redirect::back()->with('success', 'Oprasional berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting oprasional: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus oprasional. Silahkan coba lagi.');
        }
    }

    private function handleProof($request, $oprasional = null)
    {
        if ($request->hasFile('proof')) {
            if ($oprasional && $oprasional->proof) {
                Storage::delete($oprasional->proof);
            }
            return $request->file('proof')->store('oprasionals');
        }
        if ($oprasional && $oprasional->proof) {
            return $oprasional->proof;
        }
    }
}
