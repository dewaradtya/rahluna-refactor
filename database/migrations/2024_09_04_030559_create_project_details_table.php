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
        Schema::create('project_details', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignId('project_id')->constrained('projects');
            $table->foreignId('customer_id')->nullable()->constrained('customers');
            $table->string('requirement', 100);
            $table->text('note')->nullable();
            // $table->integer('tax'); // pajak
            // $table->integer('tax_percentage'); // persen pajak
            $table->decimal('amount', 11)->default(0);
            $table->foreignId('tax_id')->nullable()->constrained('taxes');
            $table->foreignId('user_id')->constrained('users');
            $table->string('proof')->nullable(); // bukti
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_details');
    }
};
