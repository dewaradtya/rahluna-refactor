<?php

namespace Database\Seeders;

use App\Models\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserRole::create([
            'name' => 'Admin',
            'slug' => 'admin',
        ]);
        UserRole::create([
            'name' => 'Member',
            'slug' => 'member',
        ]);
    }
}
