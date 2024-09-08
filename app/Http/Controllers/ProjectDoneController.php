<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectDoneController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $projects = Project::with(['customer', 'projectDetail'])->where('status', 'selesai')->paginate($perPage)->appends($request->query());
        $customers = Customer::all();
        $product = Product::all();

        return Inertia::render('Project/Done/Index', compact('projects', 'customers', 'product' ));
    }
}
