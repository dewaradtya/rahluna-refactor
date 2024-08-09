<?php

namespace Database\Seeders;

use App\Models\UserAccessMenu;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserAccessMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 19; $i++) {
            UserAccessMenu::create([
                'user_role_id' => 1,
                'menu_id' => $i
            ]);
        }
    }
}
