<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Author extends Model
{
    protected $fillable = [
        'author_name',
        'author_profile',
        'featured_image',
    ];

    public function blogs(): HasMany
    {
        return $this->hasMany(Blog::class);
    }
}
