<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Korisnik extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'korisnici';

    protected $fillable = [
        'ime',
        'email',
        'lozinka',
        'tip',
    ];

    protected $hidden = [
        'lozinka',
        'remember_token',
    ];

    // Laravelu kažemo da koristi "lozinka" umesto "password"
    public function getAuthPassword()
    {
        return $this->lozinka;
    }

    // Korisnik može imati više recepata
    public function recepti()
    {
        return $this->hasMany(Recept::class, 'korisnik_id');
    }
}

