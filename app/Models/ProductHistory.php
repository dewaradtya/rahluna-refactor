<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductHistory extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['qty', 'price', 'purchase_price', 'note', 'status', 'product_origin_id', 'product_id'];

    public function productOrigin()
    {
        return $this->belongsTo(Product::class, 'product_origin_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
