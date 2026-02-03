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
        Schema::table('sastojci', function (Blueprint $table) {
            $table->string('kolicina', 100)->default('')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sastojci', function (Blueprint $table) {
            $table->string('kolicina', 255)->default(null)->change();
        });
    }
};
