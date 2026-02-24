<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sastojak;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class SastojakController extends Controller{

    #[OA\Get(
        path: 'api/sastojci/',
        tags: ['Sastojci'],
        summary: 'Lista svih sastojaka',
        responses: [
            new OA\Response(response: 200, description: 'Uspešno', content: new OA\JsonContent(type: 'array', items: new OA\Items(type: 'object'))),
        ]
    )]
    public function index(){
        return response()->json(Sastojak::all());
    }

    #[OA\Post(
        path: '/api/sastojci',
        tags: ['Sastojci'],
        summary: 'Kreiranje novog sastojka',
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['ime', 'kolicina', 'recept_id'],
                properties: [
                    new OA\Property(property: 'ime', type: 'string', example: 'Brašno'),
                    new OA\Property(property: 'kolicina', type: 'string', example: '500g'),
                    new OA\Property(property: 'recept_id', type: 'integer', example: 1),
                    new OA\Property(property: 'dostupno', type: 'boolean', example: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Sastojak kreiran'),
            new OA\Response(response: 422, description: 'Validaciona greška'),
            new OA\Response(response: 401, description: 'Neautorizovan'),
        ]
    )]
    public function store(Request $request){
        $request->validate([
            'ime' => 'required|string|max:255',
            'kolicina' => 'required|string|max:255',
            'recept_id' => 'required|exists:recepti,id'
        ]);

        $sastojak = Sastojak::create([
            'ime' => $request->ime,
            'kolicina' => $request->kolicina,
            'recept_id' => $request->recept_id,
            'dostupno' => $request->dostupno ?? true
        ]);

        return response()->json($sastojak, 201);
    }

    #[OA\Delete(
        path: '/api/sastojci/{id}',
        tags: ['Sastojci'],
        summary: 'Brisanje sastojka',
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [
            new OA\Response(response: 200, description: 'Sastojak obrisan'),
            new OA\Response(response: 404, description: 'Sastojak nije pronađen'),
        ]
    )]
    public function destroy($id){
        $sastojak = Sastojak::findOrFail($id);
        $sastojak->delete();

        return response()->json(['message' => 'Sastojak obrisan.']);
    }

    #[OA\Put(
        path: '/api/sastojci/{id}/dostupno',
        tags: ['Sastojci'],
        summary: 'Izmena dostupnosti sastojka (samo dobavljač)',
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['dostupno'],
                properties: [
                    new OA\Property(property: 'dostupno', type: 'boolean', example: false),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Dostupnost izmenjena'),
            new OA\Response(response: 403, description: 'Zabranjen pristup'),
        ]
    )]
    public function updateDostupno(Request $request, $id){
        $user = auth()->user();
        if ($user->tip !== 'dobavljac') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $sastojak = Sastojak::findOrFail($id);
        $sastojak->dostupno = $request->dostupno;
        $sastojak->save();

        return response()->json($sastojak);
    }
}