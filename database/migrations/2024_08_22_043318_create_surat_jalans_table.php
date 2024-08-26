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
        Schema::create('surat_jalans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_jalan_new_id')->constrained('surat_jalan_news');
            $table->foreignId('customer_id')->constrained('customers');
            $table->foreignId('product_id')->constrained('products');
            $table->decimal('purchase_price', 11)->default(0);
            $table->decimal('price', 11)->default(0);
            $table->integer('qty')->default(0);
            $table->text('note')->nullable();
            $table->string('kategori', 50);
            $table->timestamp('first_create')->useCurrent();
            $table->timestamp('last_update')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_jalans');
    }
};
