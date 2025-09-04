<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Applicant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'mobile',
        'alternate_mobile',
        'resume',
        'skills',
        'dob',
        'marital_status',
        'gender',
        'experience',
        'joining_timeframe',
        'bond_agreement',
        'branch',
        'graduate_year',
        'street_address',
        'country',
        'state',
        'city',
    ];
} 