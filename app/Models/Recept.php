<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Recept extends Model
{
    use HasFactory;

    protected $table = 'recepti';

    protected $fillable = [
        'naziv',
        'opis',
        'kategorija',
        'putanja_slike',
        'status',
        'korisnik_id',
    ];

    //Recept pripada jednom korisniku
    public function korisnik()
    {
        return $this->belongsTo(Korisnik::class, 'korisnik_id');
    }

    //Recept moze da ima vise sastojaka
    public function sastojci()
    {
        return $this->hasMany(Sastojak::class, 'recept_id');
    }
}
