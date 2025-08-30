<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'event_date',
        'start_time',
        'end_time',
        'location',
        'capacity',
        'status',
        'organizer',
        'image_path',
        'tags',
    ];

    protected $casts = [
        'event_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'tags' => 'array',
    ];

    public function scopeUpcoming($query)
    {
        return $query->where('event_date', '>=', now()->toDateString())
                    ->where('status', 'upcoming');
    }

    public function scopeCompleted($query)
    {
        return $query->where('event_date', '<', now()->toDateString())
                    ->orWhere('status', 'completed');
    }
}
