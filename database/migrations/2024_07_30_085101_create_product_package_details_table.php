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
        Schema::create('product_package_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_package_id')->constrained('product_packages');
            $table->foreignId('product_id')->constrained('products');
            $table->decimal('purchase_price', 11)->default(0);
            $table->decimal('price', 11)->default(0);
            $table->integer('qty')->default(0);
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
        Schema::dropIfExists('product_package_details');
    }
};
