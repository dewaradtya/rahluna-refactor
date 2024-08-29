<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SuratJalan extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['surat_jalan_new_id', 'customer_id', 'product_id', 'purchase_price', 'price', 'qty', 'note', 'kategori'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function suratJalanNew()
    {
        return $this->belongsTo(SuratJalanNew::class, 'surat_jalan_new_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
}
