<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ErrorController extends Controller
{
    public function forbidden()
    {
        return Inertia::render('Error/Forbidden');
    }

    public function notFound()
    {
        return Inertia::render('Error/NotFound');
    }
}
