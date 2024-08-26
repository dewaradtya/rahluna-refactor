<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id(); // id sebagai primary key dengan auto-increment
            $table->string('nama_invoice', 255);
            $table->foreignId('customer_id')->constrained('customers');
            $table->string('referensi', 255);
            $table->string('kwitansi', 255);
            $table->bigInteger('nilai_ppn');
            $table->bigInteger('total_nilai');
            $table->bigInteger('total_bayar');
            $table->bigInteger('ppn_pph_customer');
            $table->bigInteger('ppn_customer');
            $table->bigInteger('pph_customer');
            $table->integer('discount');
            $table->double('ppn');
            $table->bigInteger('pengurang_harga');
            $table->string('faktur_pajak', 255)->default('default.jpg');
            $table->string('bukti_customer', 255)->default('default.jpg');
            $table->text('payment_term');
            $table->text('note');
            $table->date('due_date');
            $table->date('tanggal_dibuat');
            $table->foreignId('user_id')->constrained('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
