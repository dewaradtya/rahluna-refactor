<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = false;

    protected $fillable = ['name', 'stock', 'unit', 'price', 'purchase_price', 'user_id'];

    public function histories()
    {
        return $this->hasMany(ProductHistory::class, 'product_id');
    }

    public function packageDetails()
{
    return $this->hasMany(ProductPackageDetail::class, 'product_id');
}

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($product) {
            $product->histories()->delete();
            $product->packageDetails()->delete();
        });
    }
}
