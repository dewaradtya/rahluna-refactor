<?php

namespace App\Http\Controllers;

use App\Http\Requests\SuratjalanNewUpdateRequest;
use App\Models\SuratJalanNew;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SuratJalanNewController extends Controller
{
    public function update(SuratjalanNewUpdateRequest $request, int $suratJalanNew): RedirectResponse
    {
        try {
            $suratJalanNew = SuratJalanNew::findOrFail($suratJalanNew);

            $validatedData = $request->validated();
            $suratJalanNew->update($validatedData);

            return Redirect::back()->with('success', 'Produk berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating product: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah produk. Silahkan coba lagi.');
        }
    }

    public function show(Request $request, int $id): Response|RedirectResponse
    {
        try {
            $perPage = $request->query('perPage', 200);
            $currentPage = $request->query('page', 1);

            $suratJalanNew = SuratJalanNew::with('customer')->findOrFail($id);
            $suratJalan = $suratJalanNew->suratJalan()->with(['product', 'productPackage'])->paginate($perPage, ['*'], 'page', $currentPage)->appends($request->query());

            return Inertia::render('Transaction/SuratJalan/Detail/SjNewDetail/Index', [
                'suratJalanNew' => $suratJalanNew,
                'suratJalan' => $suratJalan,
            ]);
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Paket produk tidak ditemukan');
        }
    }

    public function destroy(int $suratJalanNew): RedirectResponse
    {
        try {
            $suratJalanNew = SuratJalanNew::findOrFail($suratJalanNew);

            $suratJalans = $suratJalanNew->suratJalan;

            foreach ($suratJalans as $suratJalan) {
                $product = $suratJalan->product;
                if ($product) {
                    $product->stock += $suratJalan->qty;
                    $product->save();
                }

                $suratJalan->delete();
            }

            $suratJalanNew->delete();

            return Redirect::back()->with('success', 'Produk berhasil dihapus dan stok dikembalikan.');
        } catch (\Exception $e) {
            Log::error('Error deleting product and returning stock: ', ['exception' => $e]);

            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus produk dan mengembalikan stok. Silahkan coba lagi.');
        }
    }
}
