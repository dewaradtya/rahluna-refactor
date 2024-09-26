<?php

namespace App\Http\Controllers;

use App\Exports\ProjectExport;
use App\Http\Requests\ProjectStoreRequest;
use App\Http\Requests\ProjectUpdateRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Project;
use App\Models\ProjectDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage', 200);
        $currentPage = $request->query('page', 1);

        $projects = Project::with(['customer', 'projectDetail'])
            ->where('status', 'berlangsung')
            ->paginate($perPage, ['*'], 'page', $currentPage)
            ->appends($request->query());

        $projects->getCollection()->transform(function ($project) {
            $requirements = ['Oprasional', 'Sewa Alat', 'Konsumsi', 'Transport', 'Aset', 'Material', 'Pekerja', 'Uang Masuk'];

            foreach ($requirements as $requirement) {
                $project->{'total_' . strtolower(str_replace(' ', '_', $requirement))} = $project->projectDetail
                    ->where('requirement', $requirement)
                    ->sum('amount');
            }

            return $project;
        });

        $customers = Customer::all();
        $product = Product::all();

        return Inertia::render('Project/Index', compact('projects', 'customers', 'product'));
    }

    public function store(ProjectStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['user_id'] = auth()->id();
            $validatedData['status'] = "berlangsung";
            Project::create($validatedData);

            DB::commit();
            return Redirect::back()->with('success', 'Projek berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing project: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah projek. Silahkan coba lagi.');
        }
    }

    public function show(Request $request, int $id): Response|RedirectResponse
    {
        try {
            $perPage = $request->query('perPage', 200);
            $currentPage = $request->query('page', 1);

            $project = Project::findOrFail($id);
            $projectDetail = $project->projectDetail()->with(['customer', 'tax'])->paginate($perPage, ['*'], 'page', $currentPage)->appends($request->query());
            $customer = Customer::all();
            $product = Product::all();

            return Inertia::render('Project/Detail/Index', [
                'project' => $project,
                'projectDetail' => $projectDetail,
                'product' => $product,
                'customer' => $customer,
            ]);
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Projek tidak ditemukan');
        }
    }

    public function update(ProjectUpdateRequest $request, int $projects): RedirectResponse
    {
        try {
            $projects = Project::findOrFail($projects);

            $validatedData = $request->validated();
            $projects->update($validatedData);

            return Redirect::back()->with('success', 'Projek berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating project: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah projek. Silahkan coba lagi.');
        }
    }

    public function destroy(int $projects): RedirectResponse
    {
        try {
            $projects = Project::findOrFail($projects);
            $projects->projectDetail()->delete();

            $projects->delete();

            return Redirect::back()->with('success', 'Projek berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting projects: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus projek detail. Silahkan coba lagi.');
        }
    }


    public function exportExcel()
    {
        return Excel::download(new ProjectExport, 'Project.xlsx');
    }

    public function complete(Project $project): RedirectResponse
    {
        try {
            $project->update(['status' => 'selesai']);

            return back()->with('success', 'Status projek berhasil diperbarui menjadi selesai.');
        } catch (\Exception $e) {
            Log::error('Error completing project: ', ['exception' => $e]);
            return back()->with('error', 'Terjadi kesalahan saat memperbarui status projek.');
        }
    }
}
