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
        Schema::create('recepts', function (Blueprint $table) {
            $table->id(); // recept_id
            $table->string('naziv');
            $table->text('opis');
            $table->string('kategorija');
            $table->string('putanja_slike')->nullable();
            $table->enum('status', ['na_cekanju', 'odobren'])->default('na_cekanju');
            $table->foreignId('korisnik_id')->constrained('korisnici')->onDelete('cascade');
            $table->timestamps(); // kreirano i promenjeno
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recepts');
    }
};
