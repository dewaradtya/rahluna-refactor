<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Illuminate\Support\Facades\DB;

class ProductExport implements FromCollection, WithHeadings, WithTitle
{
    public function collection()
    {
        return Product::select('name', 'unit', DB::raw('SUM(stock) as stock'), 'price', 'purchase_price')
            ->groupBy('name', 'unit', 'price', 'purchase_price')
            ->get();
    }

    public function headings(): array
    {
        return ['Nama Produk', 'Satuan', 'Stock', 'Harga Jual', 'Harga Beli'];
    }

    public function title(): string
    {
        return 'Product';
    }
}