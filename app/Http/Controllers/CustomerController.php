<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\CustomerStoreRequest;
use App\Http\Requests\CustomerUpdateRequest;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $customers = Customer::paginate($perPage)->appends($request->query());

        return Inertia::render('Customer/Index', compact('customers'));
    }

    public function store(CustomerStoreRequest $request): RedirectResponse
    {
        try {
            $validatedData = $request->validated();
            $validatedData['identity'] = $this->handleIdentity($request);
            Customer::create($validatedData);

            return Redirect::back()->with('success', 'Customer berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error storing customer: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah customer. Silahkan coba lagi.');
        }
    }

    public function update(CustomerUpdateRequest $request, int $customer): RedirectResponse
    {
        try {
            $customer = Customer::findOrFail($customer);

            $validatedData = $request->validated();
            $validatedData['identity'] = $this->handleIdentity($request, $customer);
            $customer->update($validatedData);

            return Redirect::back()->with('success', 'Customer berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating customer: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah customer. Silahkan coba lagi.');
        }
    }

    public function destroy(int $customer): RedirectResponse
    {
        try {
            $customer = Customer::findOrFail($customer);

            if ($customer->identity) {
                Storage::delete($customer->identity);
            }
            $customer->delete();

            return Redirect::back()->with('success', 'Customer berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting customer: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus customer. Silahkan coba lagi.');
        }
    }

    private function handleIdentity($request, $customer = null)
    {
        if ($request->hasFile('identity')) {
            if ($customer && $customer->identity) {
                Storage::delete($customer->identity);
            }
            return $request->file('identity')->store('customers');
        }
        if ($customer && $customer->identity) {
            return $customer->identity;
        }
    }
}
