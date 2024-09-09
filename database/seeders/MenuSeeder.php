<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Menu::create([
            'menu' => 'Dashboard',
            'url' => '/',
            'group_menu' => 'Admin',
            'icon' => 'fa fa-home',
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Customer',
            'url' => '/customer',
            'group_menu' => 'Admin',
            'icon' => 'fa fa-users',
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Project',
            'url' => '-',
            'group_menu' => 'Sales',
            'icon' => 'fa fa-briefcase',
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Berlangsung',
            'url' => '/project',
            'group_menu' => 'Sales',
            'main_menu' => 3,
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Selesai',
            'url' => '/projects/done',
            'group_menu' => 'Sales',
            'main_menu' => 3,
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Oprasional',
            'url' => '/oprasional',
            'group_menu' => 'Sales',
            'icon' => 'fa fa-briefcase',
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Product',
            'url' => '-',
            'group_menu' => 'Sales',
            'icon' => 'fa fa-boxes',
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Product',
            'url' => '/products',
            'group_menu' => 'Sales',
            'main_menu' => 7,
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'History',
            'url' => '/products/history',
            'group_menu' => 'Sales',
            'main_menu' => 7,
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Unit',
            'url' => '/units',
            'group_menu' => 'Sales',
            'main_menu' => 7,
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Purchase',
            'url' => '/purchase',
            'group_menu' => 'Sales',
            'icon' => 'fa fa-exchange-alt',
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Transaksi',
            'url' => '-',
            'group_menu' => 'Sales',
            'icon' => 'fa fa-exchange-alt',
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Surat Jalan',
            'url' => '/transaksi/suratJalan',
            'group_menu' => 'Sales',
            'main_menu' => 12,
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Invoice Jual',
            'url' => '/transaksi/invoiceJual',
            'group_menu' => 'Sales',
            'main_menu' => 12,
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Invoice Hutang Beli',
            'url' => '/transaksi/invoiceHutang',
            'group_menu' => 'Sales',
            'main_menu' => 12,
            'is_active' => true,
        ]);

        Menu::create([
            'menu' => 'Tax',
            'url' => '-',
            'group_menu' => 'General',
            'icon' => 'fa fa-percent',
            'is_active' => true,
        ]);
        Menu::create([
            'menu' => 'Tax Page',
            'url' => '/',
            'group_menu' => 'General',
            'main_menu' => 16,
            'is_active' => true,
        ]);
        Menu::create([
            'menu' => 'Potongan PPN dan PPH',
            'url' => '/modal',
            'group_menu' => 'General',
            'main_menu' => 16,
            'is_active' => true,
        ]);
        Menu::create([
            'menu' => 'Kelola',
            'url' => '-',
            'group_menu' => 'General',
            'icon' => 'fa fa-cog',
            'is_active' => true,
        ]);
        Menu::create([
            'menu' => 'Modal',
            'url' => '/modal',
            'group_menu' => 'General',
            'main_menu' => 19,
            'is_active' => true,
        ]);
        Menu::create([
            'menu' => 'Hutang',
            'url' => '/hutang',
            'group_menu' => 'General',
            'main_menu' => 19,
            'is_active' => true,
        ]);
        Menu::create([
            'menu' => 'Piutang',
            'url' => '/piutang',
            'group_menu' => 'General',
            'main_menu' => 19,
            'is_active' => true,
        ]);
        Menu::create([
            'menu' => 'Logout',
            'url' => '-',
            'group_menu' => 'General',
            'icon' => 'fa fa-sign-out-alt',
            'is_active' => true,
        ]);
    }
}
