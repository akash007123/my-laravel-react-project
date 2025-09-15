<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogSection extends Model
{
    protected $fillable = [
        'blog_id',
        'heading',
        'content',
        'image_path',
        'image_url',
        'sort_order',
    ];

    public function blog(): BelongsTo
    {
        return $this->belongsTo(Blog::class);
    }
}
