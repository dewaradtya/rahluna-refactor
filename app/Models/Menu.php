<?php

namespace App\Models;

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
        $userRoleId = UserRole::where('slug', 'super-admin')->value('id');

        $menus = Menu::leftJoin('user_access_menus', function ($join) use ($userRoleId) {
            $join->on('menus.id', '=', 'user_access_menus.menu_id')
                ->where('user_access_menus.user_role_id', '=', $userRoleId);
        })
            ->select('menus.*', DB::raw('user_access_menus.id IS NOT NULL as user_access_is_active'))
            ->get()
            ->filter(fn ($menu) => $menu->user_access_is_active);

        // Buat koleksi untuk menyimpan menu dengan submenus
        $mainMenus = $menus->whereNull('main_menu')->values();
        $subMenus = $menus->whereNotNull('main_menu');

        // Tambahkan submenu ke menu utama yang sesuai
        $mainMenus->each(function ($mainMenu) use ($subMenus) {
            $mainMenu->submenus = $subMenus->where('main_menu', $mainMenu->id)->values();
        });

        // Kelompokkan menu berdasarkan group_menu dengan urutan tertentu
        $groupOrder = ['Admin', 'Sales', 'General'];
        $groupedMenus = collect($groupOrder)->mapWithKeys(function ($group) use ($mainMenus) {
            return [$group => $mainMenus->where('group_menu', $group)->values()];
        });

        // Kembalikan menu yang dikelompokkan dengan submenus yang sesuai
        return $groupedMenus->toArray();
    }
}
