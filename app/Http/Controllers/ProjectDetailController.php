<?php

namespace App\Http\Controllers;

use App\Exports\ProjectDetailExport;
use App\Http\Requests\ProjectUangKeluarStoreRequest;
use App\Http\Requests\ProjectUangKeluarUpdateRequest;
use App\Http\Requests\ProjectUangMasukStoreRequest;
use App\Imports\ProjectDetailImport;
use App\Models\ProjectDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Maatwebsite\Excel\Facades\Excel;

class ProjectDetailController extends Controller
{
    public function update(ProjectUangKeluarUpdateRequest $request, int $projects): RedirectResponse
    {
        try {
            $projects = ProjectDetail::findOrFail($projects);

            $validatedData = $request->validated();
            $projects->update($validatedData);

            return Redirect::back()->with('success', 'Projek berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating project: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah projek. Silahkan coba lagi.');
        }
    }

    public function destroy(int $projectDetail): RedirectResponse
    {
        try {
            $projectDetail = ProjectDetail::findOrFail($projectDetail);
            $projectDetail->delete();

            return Redirect::back()->with('success', 'Projek detail berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting projects: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus projek detail. Silahkan coba lagi.');
        }
    }

    public function show(Request $request, int $id)
    {
        // 
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

    public function downloadFormat($projectId)
    {
        return Excel::download(new ProjectDetailExport($projectId), 'project_details.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        $file = $request->file('file');

        Excel::import(new ProjectDetailImport($request->project_id), $file);

        return redirect()->back()->with('success', 'Project details imported successfully.');
    }
}
