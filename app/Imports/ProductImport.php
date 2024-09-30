<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\ProductHistory;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Auth;

class ProductImport implements ToModel, WithHeadingRow
{
    private $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    public function model(array $row)
    {
        $product = Product::where('name', $row['nama_produk'])
                          ->where('price', $row['harga_jual'])
                          ->where('purchase_price', $row['harga_beli'])
                          ->first();

        if ($product) {
            $product->stock += $row['stock'];
            $product->save();

            ProductHistory::create([
                'qty' => $row['stock'],
                'price' => $product->price,
                'purchase_price' => $product->purchase_price,
                'product_origin_id' => $product->id,
                'product_id' => $product->id,
                'status' => 'tambah stok',
            ]);
        } else {
            $newProduct = Product::create([
                'name'           => $row['nama_produk'],
                'stock'          => $row['stock'],
                'unit'           => $row['satuan'],
                'price'          => $row['harga_jual'],
                'purchase_price' => $row['harga_beli'],
                'user_id'        => $this->userId,
            ]);

            ProductHistory::create([
                'qty' => $newProduct->stock,
                'price' => $newProduct->price,
                'purchase_price' => $newProduct->purchase_price,
                'product_origin_id' => $newProduct->id,
                'product_id' => $newProduct->id,
                'status' => 'stok awal',
            ]);
        }
    }
}
