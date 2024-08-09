<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('User/Index');
    }

    public function show(Request $request): Response
    {
        return Inertia::render('User/Profile');
    }
}
