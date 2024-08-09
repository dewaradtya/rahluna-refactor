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
        Schema::create('oprasionals', function (Blueprint $table) {
            $table->id();
            $table->date('date'); // tanggal
            $table->text('description')->nullable(); // keterangan
            $table->decimal('amount', 11)->default(0); // nilai
            $table->decimal('total_payment', 11)->default(0); // total bayar
            $table->decimal('interest_amount')->default(0); // bunga
            // $table->integer('tax'); // pajak
            // $table->integer('tax_percentage'); // persen pajak
            $table->boolean('cashflow')->default(false)->nullable(); // cashflow
            $table->string('funding')->nullable(); // dana
            $table->string('origin')->nullable();// asal
            $table->string('proof')->nullable(); // bukti
            $table->foreignId('tax_id')->nullable()->constrained('taxes');
            $table->foreignId('user_id')->constrained('users');
            $table->timestamp('first_create')->useCurrent();
            $table->timestamp('last_update')->useCurrent()->useCurrentOnUpdate();
            // $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('oprasionals');
    }
};
