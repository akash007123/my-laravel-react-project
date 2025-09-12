<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile',
        'fullname',
        'email',
        'phone',
        'designation',
        'company',
        'message',
        'rating',
        'is_active',
    ];
} 