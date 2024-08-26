<?php

namespace Database\Seeders;

use App\Models\UserAccessMenu;
use Illuminate\Database\Seeder;
use App\Models\Menu;

class UserAccessMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menuIds = Menu::pluck('id')->toArray();

        foreach ($menuIds as $id) {
            UserAccessMenu::create([
                'user_role_id' => 1,
                'menu_id' => $id
            ]);
        }
    }
}
