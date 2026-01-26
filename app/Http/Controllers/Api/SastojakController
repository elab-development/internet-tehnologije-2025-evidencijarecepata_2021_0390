<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sastojak;
use Illuminate\Http\Request;


class SastojakController extends Controller
{
    // Prikaz svih sastojaka (public ruta)
    public function index()
    {
        return response()->json(Sastojak::all());
    }

    // Kreiranje novog sastojka (zaštićena ruta)
    public function store(Request $request)
    {
        $request->validate([
            'naziv' => 'required|string|max:255',
            'dostupno' => 'required|boolean',
        ]);

        $sastojak = Sastojak::create([
            'naziv' => $request->naziv,
            'dostupno' => $request->dostupno,
        ]);

        return response()->json($sastojak, 201);
    }

    // Brisanje sastojka (zaštićena ruta)
    public function destroy($id)
    {
        $sastojak = Sastojak::findOrFail($id);
        $sastojak->delete();

        return response()->json(['message' => 'Sastojak obrisan.']);
    }

    //za dovavljaca
    public function updateDostupno(Request $request, $id){

        $user = auth()->user();
        if ($user->tip !== 'dobavljac') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $sastojak = Sastojak::findOrFail($id);
        $sastojak->dostupno = $request->dostupno; // true/false
        $sastojak->save();

        return response()->json($sastojak);
    }
}
