<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Purchase extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'referensi',
        'project_id',
        'customer_id',
        'supply',
        'address',
        'total_value',
        'discount',
        'ppn',
        'tax_invoice',
        'purchase_invoice',
        'delivery_date',
        'date',
        'user_id',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function purchaseDetail(): HasMany
    {
        return $this->hasMany(PurchaseDetail::class);
    }
}
