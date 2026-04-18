<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->cascadeOnDelete();
            $table->foreignId('project_task_id')->constrained('project_tasks')->cascadeOnDelete();
            $table->enum('status', ['not_submitted', 'submitted', 'reviewed'])->default('not_submitted');
            $table->string('file_path')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('score', 5, 2)->nullable();
            $table->text('score_notes')->nullable();
            $table->foreignId('scored_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('scored_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('deadline_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['application_id', 'project_task_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_submissions');
    }
};
