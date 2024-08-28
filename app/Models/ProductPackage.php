<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductPackage extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = false;

    protected $fillable = ['name', 'purchase_price', 'price', 'unit', 'user_id'];


    public function productPackageDetails(): HasMany
    {
        return $this->hasMany(ProductPackageDetail::class, 'product_package_id');
    }
}
