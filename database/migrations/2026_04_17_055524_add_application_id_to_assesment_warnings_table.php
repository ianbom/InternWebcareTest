<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assesment_warnings', function (Blueprint $table) {
            $table->foreignId('application_id')
                ->after('assessment_id')
                ->constrained('applications')
                ->cascadeOnDelete();

            $table->foreignId('candidate_id')
                ->after('application_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // action type: 'tab_switch', 'blocked_shortcut', 'context_menu', 'copy', 'cut', 'paste', 'dragstart', 'refresh_attempt'
            $table->string('action')->change(); // already exists, keep it
            $table->string('description')->nullable()->after('action');
        });
    }

    public function down(): void
    {
        Schema::table('assesment_warnings', function (Blueprint $table) {
            $table->dropForeign(['application_id']);
            $table->dropForeign(['candidate_id']);
            $table->dropColumn(['application_id', 'candidate_id', 'description']);
        });
    }
};
