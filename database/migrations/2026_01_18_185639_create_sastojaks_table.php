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
        Schema::create('sastojci', function (Blueprint $table) {
            $table->id(); // sastojak_id
            $table->string('ime');
            $table->string('kolicina');
            $table->boolean('dostupno')->default(true);
            $table->foreignId('recept_id')->constrained('recepti')->onDelete('cascade');
            $table->timestamps(); // kreirano i promenjeno
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sastojaks');
    }
};
