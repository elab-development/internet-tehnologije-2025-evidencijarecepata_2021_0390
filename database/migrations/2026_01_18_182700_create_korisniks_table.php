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
        Schema::create('korisnici', function (Blueprint $table) {
            $table->id(); //id korisnika
            $table->string('ime');
            $table->string('email')->unique(); //ne moze da postoji 2 ista email-a
            $table->string('lozinka');
            $table->enum('tip', ['amater', 'profesionalac', 'dobavljac'])->default('amater');
            $table->timestamps(); //automatski dodaje polja created_at i updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('korisniks');
    }
};
