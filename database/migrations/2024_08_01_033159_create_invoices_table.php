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
            $table->id(); 
            $table->string('nama_invoice', 255);
            $table->foreignId('customer_id')->constrained('customers');
            $table->string('referensi', 255);
            $table->string('kwitansi', 255);
            $table->bigInteger('nilai_ppn')->default(0);
            $table->bigInteger('total_nilai')->default(0);
            $table->bigInteger('total_bayar')->default(0);
            $table->bigInteger('ppn_pph_customer')->default(0);
            $table->bigInteger('ppn_customer')->default(0);
            $table->bigInteger('pph_customer')->default(0);
            $table->integer('discount')->default(0);
            $table->double('ppn')->nullable();
            $table->bigInteger('pengurang_harga')->default(0);
            $table->string('faktur_pajak', 255)->nullable();
            $table->string('bukti_customer', 255)->nullable();
            $table->text('payment_term');
            $table->text('note');
            $table->date('due_date');
            $table->date('tanggal_dibuat');
            $table->foreignId('user_id')->constrained('users');
            $table->timestamp('first_create')->useCurrent();
            $table->timestamp('last_update')->useCurrent()->useCurrentOnUpdate();
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
