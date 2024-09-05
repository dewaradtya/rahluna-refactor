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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('customer_id')->constrained('customers');
            $table->date('deadline');
            $table->bigInteger('nilai_penawaran');
            $table->bigInteger('material')->default(0);
            $table->bigInteger('material_inv')->default(0);
            $table->bigInteger('pekerja')->default(0);
            $table->bigInteger('oprasional')->default(0);
            $table->bigInteger('nilai_pajakM')->default(0);
            $table->bigInteger('nilai_pajakK')->default(0);
            $table->string('pajak', 20)->nullable();
            $table->string('status', 20);
            $table->foreignId('user_id')->constrained('users');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
