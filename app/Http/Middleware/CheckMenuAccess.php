<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Menu;
use App\Models\UserAccessMenu;

class CheckMenuAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        $roleId = $user->user_role_id;

        $currentUrl = $request->segment(1); 

        $menu = Menu::where('url', 'LIKE', "%$currentUrl%")->first();

        if ($menu) {
            $hasAccess = UserAccessMenu::where('user_role_id', $roleId)
                ->where('menu_id', $menu->id)
                ->exists();
            if (!$hasAccess) {
                return redirect()->route('error.403');
            }
        } else {
            return redirect()->route('error.404');
        }

        return $next($request);
    }
}
