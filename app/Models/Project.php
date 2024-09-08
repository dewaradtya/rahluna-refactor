<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'customer_id',
        'deadline',
        'nilai_penawaran',
        'material',
        'material_inv',
        'pekerja',
        'oprasional',
        'nilai_pajakM',
        'nilai_pajakK',
        'pajak',
        'status',
        'user_id',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function projectDetail(): HasMany
    {
        return $this->hasMany(ProjectDetail::class);
    }
}
