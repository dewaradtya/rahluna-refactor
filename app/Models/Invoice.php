<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $table = 'invoices';

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

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
