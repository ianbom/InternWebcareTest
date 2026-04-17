<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('positions', function (Blueprint $table) {
            if (! Schema::hasColumn('positions', 'created_by')) {
                $table->foreignId('created_by')
                    ->nullable()
                    ->after('is_active')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            $table->index('title', 'positions_admin_title_index');
            $table->index('is_active', 'positions_admin_is_active_index');
            $table->index('created_at', 'positions_admin_created_at_index');
        });

        Schema::table('assessments', function (Blueprint $table) {
            if (! Schema::hasColumn('assessments', 'created_by')) {
                $table->foreignId('created_by')
                    ->nullable()
                    ->after('duration_minutes')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            $table->index('title', 'assessments_admin_title_index');
            $table->index('position_id', 'assessments_admin_position_index');
            $table->index('created_at', 'assessments_admin_created_at_index');
        });
    }

    public function down(): void
    {
        Schema::table('assessments', function (Blueprint $table) {
            $table->dropIndex('assessments_admin_created_at_index');
            $table->dropIndex('assessments_admin_position_index');
            $table->dropIndex('assessments_admin_title_index');

            if (Schema::hasColumn('assessments', 'created_by')) {
                $table->dropConstrainedForeignId('created_by');
            }
        });

        Schema::table('positions', function (Blueprint $table) {
            $table->dropIndex('positions_admin_created_at_index');
            $table->dropIndex('positions_admin_is_active_index');
            $table->dropIndex('positions_admin_title_index');

            if (Schema::hasColumn('positions', 'created_by')) {
                $table->dropConstrainedForeignId('created_by');
            }
        });
    }
};
