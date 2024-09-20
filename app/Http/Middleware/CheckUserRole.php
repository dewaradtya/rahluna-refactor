<?php

namespace App\Http\Middleware;

use App\Models\UserRole;
use Closure;
use Illuminate\Http\Request;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $roleSlug
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $roleSlug)
    {
        $role = UserRole::where('slug', $roleSlug)->first();

        if (!$role || !$request->user() || !$request->user()->role->is($role)) {
            return redirect()->route('error.403');
        }

        return $next($request);
    }
}
