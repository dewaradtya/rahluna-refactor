<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ManageCapital extends Model
{
    use HasFactory;

    protected $table = 'oprasionals';

    public $timestamps = false;

    protected $fillable = ['date', 'amount', 'funding', 'origin', 'cashflow', 'user_id'];

    protected $hidden = ['description', 'total_payment', 'interest_amount', 'tax_id'];

    protected static function booted(): void
    {
        static::addGlobalScope('funding', function (Builder $builder) {
            $builder->where('funding', 'Modal');
        });
    }
}
