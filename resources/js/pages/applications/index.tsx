import { Head } from '@inertiajs/react';
import type {
    AdminApplicationFilters,
    AdminApplicationListItem,
    AdminApplicationStatus,
    Paginated,
} from '@/types';
import { ApplicationsFilters } from './components/ApplicationsFilters';
import { ApplicationsQueue } from './components/ApplicationsQueue';
import { useApplicationFilters } from './hooks/useApplicationFilters';
import type { PositionOption } from './types';

type Props = {
    applications: Paginated<AdminApplicationListItem>;
    filters: AdminApplicationFilters;
    options: {
        statuses: AdminApplicationStatus[];
        positions: PositionOption[];
        sorts: string[];
    };
};

export default function ApplicationsIndex({
    applications,
    filters,
    options,
}: Props) {
    const { applyFilters, draftFilters, resetFilters, setDraftFilters } =
        useApplicationFilters(filters);

    return (
        <>
            <Head title="Applications" />

            <div className="min-h-screen p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-5">
                    <ApplicationsFilters
                        draftFilters={draftFilters}
                        onApply={applyFilters}
                        onReset={resetFilters}
                        positions={options.positions}
                        setDraftFilters={setDraftFilters}
                        sorts={options.sorts}
                        statuses={options.statuses}
                    />

                    <ApplicationsQueue
                        applications={applications}
                        filters={filters}
                    />
                </div>
            </div>
        </>
    );
}
