<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Korisnik extends Model
{
    use HasFactory;

    protected $table = 'korisnici';

    protected $fillable = [
        'ime',
        'email',
        'lozinka',
        'tip',
    ];

    //Korisnik moze imati vise recepata
    public function recepti()
    {
        return $this->hasMany(Recept::class, 'korisnik_id');
    }
}
