<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'technologies',
        'description',
        'start_date',
        'end_date',
        'client_name',
        'project_manager',
        'image_path',
    ];

    protected $casts = [
        'technologies' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
