<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectStoreRequest;
use App\Http\Requests\ProjectUangKeluarStoreRequest;
use App\Http\Requests\ProjectUangMasukStoreRequest;
use App\Http\Requests\ProjectUpdateRequest;
use App\Models\Customer;
use App\Models\Project;
use App\Models\ProjectDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $projects = Project::with('customer', 'projectDetail')->paginate($perPage)->appends($request->query());
        $customers = Customer::all();

        return Inertia::render('Project/Index', compact('projects', 'customers'));
    }

    public function store(ProjectStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['user_id'] = 1;
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
            $perPage = $request->query('perPage') ?? 100;

            $project = Project::findOrFail($id);
            $projectDetail = $project->projectDetails()->with('customer')->paginate($perPage)->appends($request->query());
            $customers = Customer::all();

            return Inertia::render('Project/Detail/Index', [
                'project' => $project,
                'projectDetail' => $projectDetail,
                'customers' => $customers,
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
            $projects->delete();

            return Redirect::back()->with('success', 'Projek berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting projects: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus satuan. Silahkan coba lagi.');
        }
    }

    public function uangMasuk(ProjectUangMasukStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['user_id'] = 1;
            $validatedData['requirement'] = "Uang Masuk";
            ProjectDetail::create($validatedData);

            DB::commit();
            return Redirect::back()->with('success', 'Uang masuk berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing project: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah uang masuk. Silahkan coba lagi.');
        }
    }

    public function uangKeluar(ProjectUangKeluarStoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validated();
            $validatedData['user_id'] = 1;
            ProjectDetail::create($validatedData);

            DB::commit();
            return Redirect::back()->with('success', 'Uang keluar berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing project: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah uang keluar. Silahkan coba lagi.');
        }
    }
}
