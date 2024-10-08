<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SuratJalanNew extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['invoice_id', 'customer_id', 'no_surat', 'tanggal_kirim'];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function suratJalan(): HasMany
    {
        return $this->hasMany(SuratJalan::class);
    }
}
