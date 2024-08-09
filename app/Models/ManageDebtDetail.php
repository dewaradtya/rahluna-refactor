<?php

namespace App\Models;

use App\Models\ManageDebt;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ManageDebtDetail extends Model
{
    use HasFactory;

    protected $table = 'oprasional_details';

    public $timestamps = false;

    protected $fillable = ['date', 'description', 'amount', 'proof', 'oprasional_id', 'user_id'];


    public function debt(): BelongsTo
    {
        return $this->belongsTo(ManageDebt::class, 'oprasional_id');
    }
}
