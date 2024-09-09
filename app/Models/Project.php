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

    public function getTotalOprasionalAttribute()
    {
        return $this->projectDetail->where('requirement', 'Oprasional')->sum('amount');
    }

    public function getTotalSewaAlatAttribute()
    {
        return $this->projectDetail->where('requirement', 'Sewa Alat')->sum('amount');
    }

    public function getTotalKonsumsiAttribute()
    {
        return $this->projectDetail->where('requirement', 'Konsumsi')->sum('amount');
    }

    public function getTotalTransportAttribute()
    {
        return $this->projectDetail->where('requirement', 'Transport')->sum('amount');
    }

    public function getTotalAsetAttribute()
    {
        return $this->projectDetail->where('requirement', 'Aset')->sum('amount');
    }

    public function getTotalMaterialAttribute()
    {
        return $this->projectDetail->where('requirement', 'Material')->sum('amount');
    }

    public function getTotalPekerjaAttribute()
    {
        return $this->projectDetail->where('requirement', 'Pekerja')->sum('amount');
    }

    public function getTotalUangMasukAttribute()
    {
        return $this->projectDetail->where('requirement', 'Uang Masuk')->sum('amount');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function projectDetail(): HasMany
    {
        return $this->hasMany(ProjectDetail::class);
    }
}
