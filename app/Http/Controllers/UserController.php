<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangePinRequest;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage', 200);
        $currentPage = $request->query('page', 1);

        $users = User::paginate($perPage, ['*'], 'page', $currentPage)->appends($request->query());

        return Inertia::render('User/Index', compact('users'));
    }

    public function show(): Response
    {
        $user = Auth::user();
        return Inertia::render('User/Profile', [
            'user' => $user
        ]);
    }

    public function edit(): Response
    {
        $user = Auth::user();
        return Inertia::render('User/Edit', [
            'user' => $user
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {
            $user = Auth::user();

            $validatedData = $request->validated();
            $validatedData['profile'] = $this->handleProfileImage($request, $user);
            $user->update($validatedData);

            return Redirect::route('user.show')->with('success', 'Profile updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating user profile:', ['exception' => $e]);
            return Redirect::back()->with('error', 'An error occurred while updating your profile. Please try again.');
        }
    }

    public function ChangePin()
    {
        return Inertia::render('User/ChangePin');
    }

    public function updatePin(ChangePinRequest $request): RedirectResponse
    {
        try {
            $user = auth()->user();

            $validatedData = $request->validated();

            if ($user->pin !== $request->old_pin) {
                return redirect()->back()->withErrors(['old_pin' => 'PIN lama salah']);
            }
            $user->update($validatedData);

            return redirect()->back()->with('success', 'PIN berhasil diperbarui');
        } catch (\Exception $e) {
            Log::error('Error updating user PIN:', ['exception' => $e]);
            return Redirect::back()->with('error', 'An error occurred while updating your PIN. Please try again.');
        }
    }

    private function handleProfileImage(Request $request, User $user = null)
    {
        if ($request->hasFile('profile')) {
            if ($user && $user->profile) {
                Storage::disk('public')->delete($user->profile);
            }

            return $request->file('profile')->store('profiles', 'public');
        }

        return $user->profile ?? null;
    }
}
