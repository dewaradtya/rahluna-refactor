<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DebtInvoice extends Model
{
    use HasFactory;

    protected $table = 'oprasionals';

    public $timestamps = false;

    protected $fillable = ['date', 'amount', 'total_payment', 'description', 'funding', 'origin', 'cashflow', 'user_id'];

    protected $hidden = ['interest_amount', 'proof', 'tax_id'];

    protected $appends = ['remaining'];

    public function getRemainingAttribute()
    {
        return $this->amount - $this->total_payment;
    }

    protected static function booted(): void
    {
        static::addGlobalScope('funding', function (Builder $builder) {
            $builder->where('funding', 'Invoice Hutang');
        });
    }
}
