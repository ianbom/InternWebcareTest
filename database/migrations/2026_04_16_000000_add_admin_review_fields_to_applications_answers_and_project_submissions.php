<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            if (! Schema::hasColumn('applications', 'reviewed_by')) {
                $table->foreignId('reviewed_by')
                    ->nullable()
                    ->after('total_score')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            if (! Schema::hasColumn('applications', 'reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            }

            if (! Schema::hasColumn('applications', 'admin_notes')) {
                $table->text('admin_notes')->nullable()->after('reviewed_at');
            }

            $table->index('position_id', 'applications_admin_position_index');
            $table->index('created_at', 'applications_admin_created_at_index');
            $table->index('submitted_at', 'applications_admin_submitted_at_index');
            $table->index('total_score', 'applications_admin_total_score_index');
        });

        Schema::table('answers', function (Blueprint $table) {
            if (! Schema::hasColumn('answers', 'scored_by')) {
                $table->foreignId('scored_by')
                    ->nullable()
                    ->after('score')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            if (! Schema::hasColumn('answers', 'scored_at')) {
                $table->timestamp('scored_at')->nullable()->after('scored_by');
            }
        });

        Schema::table('project_submissions', function (Blueprint $table) {
            if (! Schema::hasColumn('project_submissions', 'scored_by')) {
                $table->foreignId('scored_by')
                    ->nullable()
                    ->after('score_notes')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            if (! Schema::hasColumn('project_submissions', 'scored_at')) {
                $table->timestamp('scored_at')->nullable()->after('scored_by');
            }
        });
    }

    public function down(): void
    {
        Schema::table('project_submissions', function (Blueprint $table) {
            if (Schema::hasColumn('project_submissions', 'scored_at')) {
                $table->dropColumn('scored_at');
            }

            if (Schema::hasColumn('project_submissions', 'scored_by')) {
                $table->dropConstrainedForeignId('scored_by');
            }
        });

        Schema::table('answers', function (Blueprint $table) {
            if (Schema::hasColumn('answers', 'scored_at')) {
                $table->dropColumn('scored_at');
            }

            if (Schema::hasColumn('answers', 'scored_by')) {
                $table->dropConstrainedForeignId('scored_by');
            }
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->dropIndex('applications_admin_total_score_index');
            $table->dropIndex('applications_admin_submitted_at_index');
            $table->dropIndex('applications_admin_created_at_index');
            $table->dropIndex('applications_admin_position_index');

            if (Schema::hasColumn('applications', 'admin_notes')) {
                $table->dropColumn('admin_notes');
            }

            if (Schema::hasColumn('applications', 'reviewed_at')) {
                $table->dropColumn('reviewed_at');
            }

            if (Schema::hasColumn('applications', 'reviewed_by')) {
                $table->dropConstrainedForeignId('reviewed_by');
            }
        });
    }
};
