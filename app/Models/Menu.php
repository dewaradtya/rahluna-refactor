<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu',
        'url',
        'icon',
        'group_menu',
        'main_menu',
        'is_active',
    ];

    public static function getSidebar()
    {
        if (!Auth::check()) {
            return [];
        }
        
        $userRoleId = Auth::user()->user_role_id;

        $menus = Menu::leftJoin('user_access_menus', function ($join) use ($userRoleId) {
            $join->on('menus.id', '=', 'user_access_menus.menu_id')
                ->where('user_access_menus.user_role_id', '=', $userRoleId);
        })
            ->select('menus.*', DB::raw('user_access_menus.id IS NOT NULL as user_access_is_active'))
            ->where('menus.is_active', true)
            ->get()
            ->filter(fn($menu) => $menu->user_access_is_active);

        $mainMenus = $menus->whereNull('main_menu')->values();
        $subMenus = $menus->whereNotNull('main_menu');

        $mainMenus->each(function ($mainMenu) use ($subMenus) {
            $mainMenu->submenus = $subMenus->where('main_menu', $mainMenu->id)->values();
        });

        $groupOrder = ['Admin', 'Sales', 'General'];
        $groupedMenus = collect($groupOrder)->mapWithKeys(function ($group) use ($mainMenus) {
            return [$group => $mainMenus->where('group_menu', $group)->values()];
        });

        return $groupedMenus->toArray();
    }
}
