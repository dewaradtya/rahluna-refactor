<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductPackageDetail extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['product_package_id', 'product_id', 'purchase_price', 'price', 'qty'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function productPackage(): BelongsTo
    {
        return $this->belongsTo(ProductPackage::class, 'product_package_id');
    }
}
