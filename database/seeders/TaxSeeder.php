<?php

namespace Database\Seeders;

use App\Models\Tax;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Tax::create([
            'tax_value' => 11,
            'tax' => 10
        ]);

        Tax::create([
            'tax_value' => 10.0909090909091,
            'tax' => 11
        ]);
    }
}
