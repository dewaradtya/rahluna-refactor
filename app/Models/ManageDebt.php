<?php

namespace App\Models;

use App\Models\ManageDebtDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ManageDebt extends Model
{
    use HasFactory;

    protected $table = 'oprasionals';

    public $timestamps = false;

    protected $fillable = ['date', 'amount', 'total_payment', 'interest_amount', 'funding', 'origin', 'cashflow', 'user_id'];

    protected $hidden = ['description', 'proof', 'tax_id'];

    protected $appends = ['remaining'];

    public function getRemainingAttribute()
    {
        return $this->amount + $this->interest_amount - $this->total_payment;
    }

    protected static function booted(): void
    {
        static::addGlobalScope('funding', function (Builder $builder) {
            $builder->where('funding', 'Hutang');
        });
    }


    public function debtDetails(): HasMany
    {
        return $this->hasMany(ManageDebtDetail::class, 'oprasional_id');
    }
}
