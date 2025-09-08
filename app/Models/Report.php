<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'report',
        'start_time',
        'end_time',
        'working_hour',
        'total_hour',
        'break_duration',
    ];

    protected $casts = [
        // add casts
    ];
} 