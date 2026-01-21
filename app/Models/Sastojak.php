<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sastojak extends Model
{
    use HasFactory;

    protected $table = 'sastojci';

    protected $fillable = [
        'ime',
        'kolicina',
        'dostupno',
        'recept_id',
    ];

    //Sastojak pripada jednom receptu (1 sastojak isti bi mogao da pripada vise recepata)
    public function recept()
    {
        return $this->belongsTo(Recept::class, 'recept_id');
    }
}
