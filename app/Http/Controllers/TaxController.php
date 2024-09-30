<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaxController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage', 200);
        $currentPage = $request->query('page', 1);

        $project = Project::paginate($perPage, ['*'], 'page', $currentPage)
            ->appends($request->query());

        return Inertia::render('Tax/Index', compact('project'));
    }
}
