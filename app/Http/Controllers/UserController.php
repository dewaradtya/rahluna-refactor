<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $users = User::paginate($perPage)->appends($request->query());

        return Inertia::render('User/Index', compact('users'));
    }

    public function show(Request $request): Response
    {
        return Inertia::render('User/Profile');
    }
}
