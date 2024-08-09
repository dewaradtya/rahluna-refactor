<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Seeders\UserRoleSeeder;
use Database\Seeders\UserAccessMenuSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([MenuSeeder::class, UserRoleSeeder::class, UserAccessMenuSeeder::class, TaxSeeder::class]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'user_role_id' => 2
        ]);
    }
}
