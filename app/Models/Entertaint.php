<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Entertaint extends Model
{
    use HasFactory;

    protected $table = 'oprasionals';

    public $timestamps = false;

    protected $fillable = ['date', 'description', 'amount', 'funding', 'proof', 'tax_id', 'user_id'];

    protected $hidden = ['total_payment', 'interest_amount', 'cashflow', 'origin'];

    protected static function booted(): void
    {
        static::addGlobalScope('funding', function (Builder $builder) {
            $builder->where('funding', 'Entertaint Cost');
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
