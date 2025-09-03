<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class report extends Model
{
    protected $fillable = [
        'report',
        'start_time',
        'end_time',
        'working_hour',
        'total_hour',
        'break_duration'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
