<?php

namespace App\Http\Controllers;
use Inertia\Inertia;


class MapController extends Controller
{
    public function show()
    {
        return Inertia::render('MapPage');
    }
}