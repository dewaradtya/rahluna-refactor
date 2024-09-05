<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDetail extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'date',
        'project_id',
        'customer_id',
        'requirement',
        'note',
        'amount',
        'tax_id',
        'user_id',
        'proof',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function tax(): BelongsTo
    {
        return $this->belongsTo(Tax::class);
    }
}
