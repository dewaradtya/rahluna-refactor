<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurchaseStoreRequest;
use App\Http\Requests\PurchaseUpdateRequest;
use App\Models\Project;
use App\Models\Purchase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PurchaseController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $purchase = Purchase::with(['customer', 'project'])->paginate($perPage)->appends($request->query());
        $project = Project::all();

        return Inertia::render('Purchase/Index', compact('purchase', 'project'));
    }

    public function store(PurchaseStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['tax_invoice'] = $this->handleTaxInvoice($request);

            $existingPurchase = Purchase::where('project_id', $validatedData['project_id'])->first();

            if ($existingPurchase) {
                return Redirect::back()->with('error', 'Purchase order untuk project ini sudah ada.');
            }

            $validatedData['user_id'] = auth()->id();
            Purchase::create($validatedData);

            DB::commit();
            return Redirect::back()->with('success', 'Purchase order berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing purchase: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah purchase order. Silahkan coba lagi.');
        }
    }

    public function update(PurchaseUpdateRequest $request, int $purchase): RedirectResponse
    {
        try {
            $purchase = Purchase::findOrFail($purchase);

            $validatedData = $request->validated();
            $validatedData['tax_invoice'] = $this->handleTaxInvoice($request, $purchase);
            $validatedData['purchase_invoice'] = $this->handlePurchaseInvoice($request, $purchase);
            $purchase->update($validatedData);

            return Redirect::back()->with('success', 'Purchase order berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating purchase: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah purchase order. Silahkan coba lagi.');
        }
    }

    public function destroy(int $purchase): RedirectResponse
    {
        try {
            $purchase = Purchase::findOrFail($purchase);
            $purchase->purchaseDetail()->delete();
            if ($purchase->tax_invoice) {
                Storage::delete($purchase->tax_invoice);
            }
            $purchase->delete();

            return Redirect::back()->with('success', 'Purchase order berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting projects: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus purchase order. Silahkan coba lagi.');
        }
    }

    public function generatePdf($id)
    {
        try {

            $purchase = Purchase::with('project')->findOrFail($id);
            $referensi = preg_replace('/[^A-Za-z0-9\-]/', '_', $purchase->referensi);
            $data = [
                'purchase' => $purchase,
            ];

            $pdf = Pdf::loadView('purchase.pdf', $data);

            $filename = "purchase-order-{$referensi}.pdf";

            return $pdf->stream($filename);
        } catch (\Exception $e) {
            Log::error('Error deleting purchase: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat membuka pdf purchase order. Silahkan coba lagi.');
        }
    }

    public function show(Request $request, int $id): Response|RedirectResponse
    {
        try {
            $perPage = $request->query('perPage') ?? 100;

            $purchase = Purchase::findOrFail($id);
            $purchaseDetails = $purchase->purchaseDetail()->paginate($perPage)->appends($request->query());

            return Inertia::render('Purchase/Detail/Index', [
                'purchase' => $purchase,
                'purchaseDetails' => $purchaseDetails,
            ]);
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Projek tidak ditemukan');
        }
    }

    private function handleTaxInvoice($request, $purchase = null)
    {
        if ($request->hasFile('tax_invoice')) {
            if ($purchase && $purchase->tax_invoice) {
                Storage::delete($purchase->tax_invoice);
            }
            return $request->file('tax_invoice')->store('purchases');
        }
        if ($purchase && $purchase->tax_invoice) {
            return $purchase->tax_invoice;
        }
    }

    private function handlePurchaseInvoice($request, $purchase = null)
    {
        if ($request->hasFile('purchase_invoice')) {
            if ($purchase && $purchase->purchase_invoice) {
                Storage::delete($purchase->purchase_invoice);
            }
            return $request->file('purchase_invoice')->store('purchases');
        }
        if ($purchase && $purchase->purchase_invoice) {
            return $purchase->purchase_invoice;
        }
    }
}
