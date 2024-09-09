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
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->string('referensi');
            $table->foreignId('project_id')->constrained('projects');
            $table->foreignId('customer_id')->nullable()->constrained('customers');
            $table->string('supply');
            $table->text('address');
            $table->bigInteger('total_value')->default(0);
            $table->bigInteger('discount')->default(0);
            $table->double('ppn')->default(0);
            $table->string('tax_invoice')->nullable();
            $table->string('purchase_invoice')->nullable();
            $table->date('delivery_date');
            $table->date('date');
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
        Schema::dropIfExists('purchases');
    }
};
