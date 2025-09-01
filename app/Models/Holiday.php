<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Holiday extends Model
{
    protected $fillable = [
        'holiday_name',
        'holiday_date',
    ];

    protected $casts = [
        'holiday_date' => 'date',
    ];

    public function getDayAttribute()
    {
        return $this->holiday_date->format('l');
    }

    public function getFormattedDateAttribute()
    {
        return $this->holiday_date->format('M d, Y');
    }
}
