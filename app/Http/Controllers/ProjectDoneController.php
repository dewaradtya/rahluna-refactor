<?php

namespace App\Http\Controllers;

use App\Exports\ProjectDoneExport;
use App\Http\Requests\ProjectDoneUpdateRequest;
use App\Http\Requests\ProjectUpdateRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ProjectDoneController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $projects = Project::with(['customer', 'projectDetail'])
            ->where('status', 'selesai')
            ->paginate($perPage)
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

        return Inertia::render('Project/Done/Index', compact('projects', 'customers', 'product'));
    }

    public function update(ProjectDoneUpdateRequest $request, int $projects): RedirectResponse
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

    public function exportExcel()
    {
        return Excel::download(new ProjectDoneExport, 'ProjectDone.xlsx');
    }
}
