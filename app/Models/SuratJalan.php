<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;

class SuratJalan extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['surat_jalan_new_id', 'customer_id', 'product_id', 'purchase_price', 'price', 'qty', 'note', 'kategori'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function productPackage()
    {
        return $this->belongsTo(ProductPackage::class, 'product_id');
    }

    public function suratJalanNew()
    {
        return $this->belongsTo(SuratJalanNew::class, 'surat_jalan_new_id');
    }

    public function productPackageDetails()
    {
        return $this->hasMany(ProductPackageDetail::class, 'product_package_id', 'product_id');
    }


    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($suratJalan) {
            if ($suratJalan->kategori === 'Produk') {
                Log::info('Deleting related product histories for Produk');
                $suratJalan->productHistories()
                    ->where('kategori', 'Produk')
                    ->where('status', 'stok terpakai')
                    ->where('first_create', $suratJalan->first_create)
                    ->delete();
            } elseif ($suratJalan->kategori === 'Paket') {
                Log::info('Deleting related product histories for Paket');

                $productIds = $suratJalan->productPackageDetails->pluck('product_id');
                Log::info('Product IDs in package: ' . $productIds);

                ProductHistory::whereIn('product_id', $productIds)
                    ->where('kategori', 'Paket')
                    ->where('status', 'stok terpakai')
                    ->where('first_create', $suratJalan->first_create)
                    ->delete();
            }
        });
    }

    public function productHistories(): HasMany
    {
        return $this->hasMany(ProductHistory::class, 'product_id', 'product_id');
    }

    public function getProductNameAttribute()
    {
        if ($this->kategori === 'Produk') {
            return $this->product ? $this->product->name : 'Produk tidak ditemukan';
        }

        if ($this->kategori === 'Paket') {
            return $this->productPackage ? $this->productPackage->name : 'Paket tidak ditemukan';
        }

        return 'Kategori tidak diketahui';
    }

    public function getUnitAttribute()
    {
        if ($this->kategori === 'Produk') {
            return $this->product ? $this->product->unit : 'Unit tidak ditemukan';
        }

        if ($this->kategori === 'Paket') {
            return $this->productPackage ? $this->productPackage->unit : 'Unit Paket tidak ditemukan';
        }

        return 'Kategori tidak diketahui';
    }
}
