<?php

namespace App\Http\Controllers;

use App\Http\Requests\EntertaintStoreRequest;
use App\Http\Requests\EntertaintUpdateRequest;
use App\Models\Entertaint;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class EntertaintController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage', 200);
        $currentPage = $request->query('page', 1);

        $entertaint = Entertaint::with(['tax'])->paginate($perPage, ['*'], 'page', $currentPage)->appends($request->query());

        return Inertia::render('Entertaint/Index', compact('entertaint'));
    }

    public function store(EntertaintStoreRequest $request): RedirectResponse
    {
        try {
            $validatedData = $request->validated();
            $validatedData['funding'] = 'Entertaint Cost';
            $validatedData['cashflow'] = $request->cashflow ? 1 : 0;
            $validatedData['user_id'] = auth()->id();
            Entertaint::create($validatedData);

            return Redirect::back()->with('success', 'Entertaint Cost berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error storing entertaint cost: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah Entertaint Cost. Silahkan coba lagi.');
        }
    }

    public function update(EntertaintUpdateRequest $request, int $entertaint): RedirectResponse
    {
        try {
            $entertaint = Entertaint::findOrFail($entertaint);

            $validatedData = $request->validated();
            $entertaint->update($validatedData);

            return Redirect::back()->with('success', 'Entertaint cost berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating entertaint cost: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah entertaint cost. Silahkan coba lagi.');
        }
    }

    public function destroy(int $entertaint): RedirectResponse
    {
        try {
            $entertaint = Entertaint::findOrFail($entertaint);

            $entertaint->delete();

            return Redirect::back()->with('success', 'Invoice Hutang berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting entertainment cost: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus invoice hutang. Silahkan coba lagi.');
        }
    }
}
