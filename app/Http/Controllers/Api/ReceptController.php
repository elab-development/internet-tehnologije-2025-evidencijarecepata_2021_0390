<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recept;
use Illuminate\Http\Request;

class ReceptController extends Controller
{
    public function index()
    {
        return response()->json(Recept::all());
    }

    public function show($id)
    {
        return response()->json(Recept::findOrFail($id));
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if (!in_array($user->tip, ['amater', 'profesionalac'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $recept = Recept::create([
            'naziv' => $request->naziv,
            'opis' => $request->opis,
            'korisnik_id' => $user->id,
            'status' => 'na cekanju',
        ]);

        return response()->json($recept, 201);
    }

    public function update(Request $request, $id)
    {
        $recept = Recept::findOrFail($id);
        $user = auth()->user();

        if ($recept->korisnik_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $recept->update($request->only(['naziv', 'opis']));
        return response()->json($recept);
    }

    public function destroy($id)
    {
        $recept = Recept::findOrFail($id);
        $user = auth()->user();

        if ($recept->korisnik_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $recept->delete();
        return response()->json(['message' => 'Recept obrisan']);
    }

    public function potvrdi(Request $request, $id){

        $user = auth()->user();
        if ($user->tip !== 'profesionalac') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $recept = Recept::findOrFail($id);
        $recept->status = $request->status; // 'potvrdjen' ili 'odbijen'
        $recept->save();

        return response()->json($recept);
    }
}
