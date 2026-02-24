<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Korisnik;
use OpenApi\Attributes as OA;

class AuthController extends Controller {

    #[OA\Post(
        path: '/api/register',
        tags: ['Autentifikacija'],
        summary: 'Registracija novog korisnika',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['ime', 'email', 'lozinka', 'tip'],
                properties: [
                    new OA\Property(property: 'ime', type: 'string', example: 'Marko Marković'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'marko@email.com'),
                    new OA\Property(property: 'lozinka', type: 'string', format: 'password', example: 'tajna123'),
                    new OA\Property(property: 'tip', type: 'string', enum: ['amater', 'profesionalac', 'dobavljac'], example: 'amater'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Uspešna registracija',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Uspešna registracija'),
                    new OA\Property(property: 'token', type: 'string', example: '1|abc123...'),
                ])
            ),
            new OA\Response(response: 422, description: 'Validaciona greška'),
        ]
    )]
    public function register(Request $request){
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

    #[OA\Post(
        path: '/api/login',
        tags: ['Autentifikacija'],
        summary: 'Prijava korisnika',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'lozinka'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'marko@email.com'),
                    new OA\Property(property: 'lozinka', type: 'string', format: 'password', example: 'tajna123'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Uspešna prijava',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Uspešna prijava'),
                    new OA\Property(property: 'token', type: 'string', example: '1|abc123...'),
                    new OA\Property(property: 'korisnik', type: 'object'),
                ])
            ),
            new OA\Response(response: 401, description: 'Pogrešni kredencijali'),
        ]
    )]
    public function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'lozinka' => 'required'
        ]);

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

    #[OA\Post(
        path: '/api/logout',
        tags: ['Autentifikacija'],
        summary: 'Odjava korisnika',
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Uspešna odjava',
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Uspešno ste se izlogovali'),
                ])
            ),
            new OA\Response(response: 401, description: 'Neautorizovan'),
        ]
    )]
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Uspešno ste se izlogovali'
        ]);
    }
}

