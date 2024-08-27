<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DebtInvoiceDetail extends Model
{
    use HasFactory;

    protected $table = 'oprasional_details';

    public $timestamps = false;

    protected $fillable = ['date', 'description', 'amount', 'proof', 'oprasional_id', 'user_id'];


    public function debtInvoice(): BelongsTo
    {
        return $this->belongsTo(DebtInvoice::class, 'oprasional_id');
    }
}
