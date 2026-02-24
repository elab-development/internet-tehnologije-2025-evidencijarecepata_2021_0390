<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recept;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ReceptController extends Controller{

    #[OA\Get(
        path: '/api/recepti',
        tags: ['Recepti'],
        summary: 'Lista svih recepata',
        responses: [
            new OA\Response(response: 200, description: 'Uspešno', content: new OA\JsonContent(type: 'array', items: new OA\Items(type: 'object'))),
        ]
    )]
    public function index(){
        return response()->json(Recept::all());
    }

    #[OA\Get(
        path: '/api/recepti/{id}',
        tags: ['Recepti'],
        summary: 'Detalji jednog recepta sa sastojcima',
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [
            new OA\Response(response: 200, description: 'Uspešno', content: new OA\JsonContent(type: 'object')),
            new OA\Response(response: 404, description: 'Recept nije pronađen'),
        ]
    )]
    public function show($id){
        return response()->json(Recept::with('sastojci')->findOrFail($id));
    }

    #[OA\Post(
        path: '/api/recepti',
        tags: ['Recepti'],
        summary: 'Kreiranje novog recepta (amater ili profesionalac)',
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['naziv', 'opis', 'kategorija'],
                properties: [
                    new OA\Property(property: 'naziv', type: 'string', example: 'Pasulj'),
                    new OA\Property(property: 'opis', type: 'string', example: 'Domaći pasulj sa dimljenim mesom'),
                    new OA\Property(property: 'kategorija', type: 'string', example: 'supe'),
                    new OA\Property(property: 'putanja_slike', type: 'string', example: 'slike/pasulj.jpg'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Recept kreiran'),
            new OA\Response(response: 403, description: 'Zabranjen pristup'),
            new OA\Response(response: 401, description: 'Neautorizovan'),
        ]
    )]
    public function store(Request $request){
        $user = auth()->user();

        if (!in_array($user->tip, ['amater', 'profesionalac'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $recept = Recept::create([
            'naziv' => $request->naziv,
            'opis' => $request->opis,
            'kategorija' => $request->kategorija,
            'putanja_slike' => $request->putanja_slike ?? null,
            'korisnik_id' => $user->id,
            'status' => 'na_cekanju',
        ]);

        return response()->json($recept, 201);
    }

    #[OA\Put(
        path: '/api/recepti/{id}',
        tags: ['Recepti'],
        summary: 'Izmena recepta (samo vlasnik)',
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'naziv', type: 'string', example: 'Novi naziv'),
                new OA\Property(property: 'opis', type: 'string', example: 'Novi opis'),
            ])
        ),
        responses: [
            new OA\Response(response: 200, description: 'Recept izmenjen'),
            new OA\Response(response: 403, description: 'Zabranjen pristup'),
            new OA\Response(response: 404, description: 'Recept nije pronađen'),
        ]
    )]
    public function update(Request $request, $id){
        $recept = Recept::findOrFail($id);
        $user = auth()->user();

        if ($recept->korisnik_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $recept->update($request->only(['naziv', 'opis']));
        return response()->json($recept);
    }

    #[OA\Delete(
        path: '/api/recepti/{id}',
        tags: ['Recepti'],
        summary: 'Brisanje recepta (samo vlasnik)',
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [
            new OA\Response(response: 200, description: 'Recept obrisan'),
            new OA\Response(response: 403, description: 'Zabranjen pristup'),
            new OA\Response(response: 404, description: 'Recept nije pronađen'),
        ]
    )]
    public function destroy($id){
        $recept = Recept::findOrFail($id);
        $user = auth()->user();

        if ($recept->korisnik_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $recept->delete();
        return response()->json(['message' => 'Recept obrisan']);
    }

    #[OA\Post(
        path: '/api/recepti/{id}/potvrda',
        tags: ['Recepti'],
        summary: 'Potvrda ili odbijanje recepta (samo profesionalac)',
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['status'],
                properties: [
                    new OA\Property(property: 'status', type: 'string', enum: ['potvrdjen', 'odbijen'], example: 'potvrdjen'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Status recepata izmenjen'),
            new OA\Response(response: 403, description: 'Zabranjen pristup'),
        ]
    )]
    public function potvrdi(Request $request, $id){
        $user = auth()->user();
        if ($user->tip !== 'profesionalac') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $recept = Recept::findOrFail($id);
        $recept->status = $request->status;
        $recept->save();

        return response()->json($recept);
    }
}