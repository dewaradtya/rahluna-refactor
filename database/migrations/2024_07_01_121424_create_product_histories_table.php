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
        Schema::create('product_histories', function (Blueprint $table) {
            $table->id();
            $table->integer('qty')->default(0);
            $table->decimal('price', 11)->default(0);
            $table->decimal('purchase_price', 11)->default(0);
            $table->text('note')->nullable();
            $table->string('status', 50);
            $table->foreignId('product_origin_id')->constrained('products');
            $table->foreignId('product_id')->nullable()->constrained('products');
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
        Schema::dropIfExists('product_histories');
    }
};
