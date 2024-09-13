<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;

    protected $table = 'invoices';

    public $timestamps = false;

    protected $fillable = [
        'nama_invoice',
        'customer_id',
        'referensi',
        'kwitansi',
        'nilai_ppn',
        'total_nilai',
        'total_bayar',
        'ppn_pph_customer',
        'ppn_customer',
        'pph_customer',
        'discount',
        'ppn',
        'pengurang_harga',
        'faktur_pajak',
        'bukti_customer',
        'payment_term',
        'note',
        'due_date',
        'tanggal_dibuat',
        'user_id'
    ];

    protected $appends = ['totalinvoice'];

    public function getTotalInvoiceAttribute()
    {
        $discount = $this->discount ?? 0;
        $pengurangHarga = $this->pengurang_harga ?? 0;
        $totalNilai = $this->total_nilai ?? 0;

        $finalValue = $totalNilai - ($totalNilai * ($discount / 100)) - $pengurangHarga;

        return $finalValue;
    }


    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function invoiceDetail(): HasMany
    {
        return $this->hasMany(InvoiceDetail::class);
    }
}
