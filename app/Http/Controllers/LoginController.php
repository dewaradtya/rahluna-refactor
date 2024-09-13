<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Import Log facade
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request)
    {
        $request->validate([
            'pin' => 'required|digits:6',
        ]);

        $user = User::where('pin', $request->pin)->first();

        if ($user) {
            Auth::login($user);

            return Redirect::intended('/');
        }

        return Redirect::back()->withErrors(['pin' => 'PIN salah.']);
    }

    public function logout(Request $request)
    {
        $user = Auth::user();

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/login');
    }
}
