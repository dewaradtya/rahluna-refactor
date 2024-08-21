<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPackageDetail extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['product_package_id', 'product_id', 'purchase_price', 'price', 'qty'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
