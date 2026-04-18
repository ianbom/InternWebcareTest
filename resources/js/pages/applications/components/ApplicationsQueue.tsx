import { ArrowUpDown } from 'lucide-react';
import type {
    AdminApplicationFilters,
    AdminApplicationListItem,
    Paginated,
} from '@/types';
import { SORT_LABELS } from '../utils/application-format';
import { ApplicationsEmptyState } from './ApplicationsEmptyState';
import { ApplicationsPagination } from './ApplicationsPagination';
import { ApplicationsTable } from './ApplicationsTable';

type ApplicationsQueueProps = {
    applications: Paginated<AdminApplicationListItem>;
    filters: AdminApplicationFilters;
};

export function ApplicationsQueue({
    applications,
    filters,
}: ApplicationsQueueProps) {
    return (
        <section className="overflow-hidden rounded-[24px] border border-[#DCE3F2] bg-white shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7ECF6] px-5 py-4">
                <div>
                    <h2 className="text-xl font-black text-[#102B5C]">
                        Application Queue
                    </h2>
                    <p className="text-sm text-[#6B7894]">
                        Auto score tetap berasal dari assessment total_score.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F5FF] px-3 py-1.5 text-xs font-bold text-[#1D449C]">
                    <ArrowUpDown className="size-3.5" />
                    {SORT_LABELS[filters.sort] ?? filters.sort}
                </div>
            </div>

            <ApplicationsTable
                applications={applications.data}
                filters={filters}
            />

            {applications.data.length === 0 && <ApplicationsEmptyState />}

            <ApplicationsPagination applications={applications} />
        </section>
    );
}
