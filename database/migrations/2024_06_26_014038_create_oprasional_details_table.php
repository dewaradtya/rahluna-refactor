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
        Schema::create('oprasional_details', function (Blueprint $table) {
            $table->id();
            $table->date('date'); // tanggal
            $table->text('description'); // keterangan
            $table->decimal('amount', 11)->default(0); // nilai
            $table->string('proof')->nullable(); // bukti
            $table->foreignId('oprasional_id')->constrained('oprasionals');
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
        Schema::dropIfExists('oprasional_details');
    }
};
