<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceDetail extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'invoice_id',
        'product_id',
        'qty', 
        'price', 
        'purchase_price', 
        'note', 
        'kategori', 
    ];

    protected $appends = ['nilai_ppn', 'discount'];

    public function getNilaiPpnAttribute()
    {
        return $this->invoice->nilai_ppn;
    }

    public function getDiscountAttribute()
    {
        return $this->invoice->discount;
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
