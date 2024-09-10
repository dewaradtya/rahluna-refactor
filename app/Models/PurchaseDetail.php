<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class PurchaseDetail extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'purchase_id',
        'product',
        'qty',
        'amount',
        'date',
    ];

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class, 'purchase_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }


    protected static function booted()
    {
        static::updated(function ($purchaseDetail) {
            self::updatePurchaseTotal($purchaseDetail->purchase_id);
        });

        static::deleted(function ($purchaseDetail) {
            self::updatePurchaseTotal($purchaseDetail->purchase_id);
        });
    }

    protected static function updatePurchaseTotal($purchaseId)
    {
        $total = self::where('purchase_id', $purchaseId)
            ->sum(DB::raw('amount * qty'));

        Purchase::where('id', $purchaseId)->update(['total_value' => $total]);
    }
}
