<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            if (!Schema::hasColumn('galleries', 'title')) {
                $table->string('title')->after('id');
            }
            if (!Schema::hasColumn('galleries', 'image_path')) {
                $table->string('image_path')->after('title');
            }
            if (!Schema::hasColumn('galleries', 'user_id')) {
                $table->foreignId('user_id')->after('image_path')->constrained()->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            if (Schema::hasColumn('galleries', 'user_id')) {
                $table->dropConstrainedForeignId('user_id');
            }
            if (Schema::hasColumn('galleries', 'image_path')) {
                $table->dropColumn('image_path');
            }
            if (Schema::hasColumn('galleries', 'title')) {
                $table->dropColumn('title');
            }
        });
    }
};
