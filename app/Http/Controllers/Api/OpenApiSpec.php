<?php

namespace App\Http\Controllers\Api;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'Evidencija Recepata API',
    version: '1.0.0',
    description: 'REST API za upravljanje receptima, sastojcima i korisnicima.',
    contact: new OA\Contact(email: 'admin@evidencijarecepata.com')
)]
#[OA\Server(url: 'http://localhost:8080', description: 'Glavni server')]
#[OA\SecurityScheme(
    securityScheme: 'sanctum',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'Token',
    description: 'Unesi token dobijen pri registraciji/prijavi'
)]
#[OA\Tag(name: 'Autentifikacija', description: 'Registracija, prijava i odjava')]
#[OA\Tag(name: 'Recepti', description: 'CRUD operacije nad receptima')]
#[OA\Tag(name: 'Sastojci', description: 'Upravljanje sastojcima')]
class OpenApiSpec {}