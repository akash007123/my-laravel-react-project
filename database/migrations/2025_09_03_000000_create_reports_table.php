<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('report');
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->decimal('working_hour', 5, 2)->default(0);
            $table->decimal('total_hour', 5, 2)->default(0);
            $table->decimal('break_duration', 5, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
}; 