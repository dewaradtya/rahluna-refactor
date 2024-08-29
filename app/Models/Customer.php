<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = false;

    protected $fillable = ['name', 'pic', 'telp', 'email', 'address', 'identity'];

    public function suratJalan(): HasMany
    {
        return $this->hasMany(SuratJalan::class, 'customer_id');
    }
}
