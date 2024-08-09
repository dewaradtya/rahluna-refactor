<?php

namespace App\Imports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ProductImport implements ToModel, WithHeadingRow
{
    private $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    public function model(array $row)
    {
        return new Product([
            'name'           => $row['nama_produk'],
            'model_number'   => $row['kode_barang'],
            'stock'          => $row['stock'],
            'unit'           => $row['satuan'],
            'price'          => $row['harga_jual'],
            'purchase_price' => $row['harga_beli'],
            'user_id'        => 1, 
        ]);
    }
}
