<?php

namespace App\Models;

use App\Models\ManageReceivable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ManageReceivableDetail extends Model
{
    use HasFactory;

    protected $table = 'oprasional_details';

    public $timestamps = false;

    protected $fillable = ['date', 'description', 'amount', 'proof', 'oprasional_id', 'user_id'];


    public function receivable(): BelongsTo
    {
        return $this->belongsTo(ManageReceivable::class, 'oprasional_id');
    }
}
