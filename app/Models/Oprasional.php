<?php

namespace App\Models;

use App\Models\Tax;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Oprasional extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['date', 'description', 'amount', 'funding', 'proof', 'tax_id', 'user_id'];

    protected $hidden = ['total_payment', 'interest_amount', 'cashflow', 'origin'];

    protected static function booted(): void
    {
        static::addGlobalScope('funding', function (Builder $builder) {
            $builder->whereNotIn('funding', ['Modal', 'Hutang', 'Piutang', 'Invoice Hutang']);
        });
    }

    /**
     * Get the tax that owns the Oprasional
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tax(): BelongsTo
    {
        return $this->belongsTo(Tax::class);
    }
}
