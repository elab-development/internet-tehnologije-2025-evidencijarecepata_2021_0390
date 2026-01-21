<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Korisnik;

class AuthController extends Controller
{
    // REGISTRACIJA
    public function register(Request $request)
    {
        $request->validate([
            'ime' => 'required|string|max:255',
            'email' => 'required|email|unique:korisnici,email',
            'lozinka' => 'required|string|min:6',
            'tip' => 'required|in:amater,profesionalac,dobavljac'
        ]);

        $korisnik = Korisnik::create([
            'ime' => $request->ime,
            'email' => $request->email,
            'tip' => $request->tip,
            'lozinka' => Hash::make($request->lozinka),
        ]);

        $token = $korisnik->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Uspešna registracija',
            'token' => $token
        ], 201);
    }

    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'lozinka' => 'required'
        ]);

        $credentials = [
            'email' => $request->email,
            'lozinka' => $request->lozinka
        ];

        // Provera kredencijala
        $korisnik = Korisnik::where('email', $request->email)->first();

        if (!$korisnik || !Hash::check($request->lozinka, $korisnik->lozinka)) {
            return response()->json([
                'message' => 'Pogrešni kredencijali'
            ], 401);
        }

        $token = $korisnik->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Uspešna prijava',
            'token' => $token,
            'korisnik' => $korisnik
        ]);
        
    }

    // LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Uspešno ste se izlogovali'
        ]);
    }
}

