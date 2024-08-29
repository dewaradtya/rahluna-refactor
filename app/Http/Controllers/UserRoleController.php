<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\UserRole;
use Illuminate\Http\Request;
use App\Models\UserAccessMenu;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;

class UserRoleController extends Controller
{
    public function index(Request $request): Response
    {
        $userRoles = UserRole::all();

        return Inertia::render('Role/Index', [
            'userRoles' => [
                'data' => $userRoles,
                'links' => [],
            ],
        ]);
    }

    public function show(Request $request, string $role): Response|RedirectResponse
    {
        try {
            $userRole = UserRole::where('slug', $role)->firstOrFail();
            $menus = Menu::leftJoin('user_access_menus', function ($join) use ($userRole) {
                $join->on('menus.id', '=', 'user_access_menus.menu_id')
                    ->where('user_access_menus.user_role_id', '=', $userRole->id);
            })
                ->select('menus.*', DB::raw('IF(user_access_menus.id IS NULL, false, true) as user_access_is_active'))
                ->latest()
                ->get();

            // if ($userRoles->id != 1) {
            //     $menus->whereIn('name', ['user', 'project', 'oprasional', 'purchase', 'invoice', 'pembayaran', 'partner', 'product', 'cashflow']);
            // }

            return Inertia::render('Role/Detail', compact('userRole', 'menus'));
        } catch (\Exception $e) {
            return  Redirect::route('role.index')->with('error', 'Role tidak ditemukan');
        }
    }

    public function changeAccess(Request $request): RedirectResponse
    {
        try {
            Validator::make($request->all(), [
                'menu_id' => 'required|exists:menus,id',
                'user_role_id' => 'required|exists:user_roles,id',
            ]);

            $userAccess = UserAccessMenu::where('menu_id', $request->menu_id)->where('user_role_id', $request->user_role_id)->first();
            if ($userAccess) {
                $userAccess->delete();
            } else {
                UserAccessMenu::create(['menu_id' => $request->menu_id, 'user_role_id' => $request->user_role_id]);
            }

            return Redirect::back()->with('success', 'Akses berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error changing access: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah akses. Silahkan coba lagi.');
        }
    }
}
