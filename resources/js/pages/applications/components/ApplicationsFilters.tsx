import { Filter, Search } from 'lucide-react';
import type { FormEvent } from 'react';
import type {
    AdminApplicationFilters,
    AdminApplicationStatus,
} from '@/types';
import type { PositionOption } from '../types';
import { SORT_LABELS, STATUS_LABELS } from '../utils/application-format';

type ApplicationsFiltersProps = {
    draftFilters: AdminApplicationFilters;
    onApply: (event: FormEvent<HTMLFormElement>) => void;
    onReset: () => void;
    positions: PositionOption[];
    setDraftFilters: (filters: AdminApplicationFilters) => void;
    sorts: string[];
    statuses: AdminApplicationStatus[];
};

export function ApplicationsFilters({
    draftFilters,
    onApply,
    onReset,
    positions,
    setDraftFilters,
    sorts,
    statuses,
}: ApplicationsFiltersProps) {
    return (
        <form
            onSubmit={onApply}
            className="rounded-[24px] border border-[#DCE3F2] bg-white p-4 shadow-[0_16px_50px_rgba(16,43,92,0.08)]"
        >
            <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.3fr)_repeat(3,minmax(150px,1fr))]">
                <label className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B7894]" />
                    <input
                        value={draftFilters.search}
                        onChange={(event) =>
                            setDraftFilters({
                                ...draftFilters,
                                search: event.target.value,
                            })
                        }
                        placeholder="Search name, email, phone, position..."
                        className="h-11 w-full rounded-2xl border border-[#DCE3F2] bg-[#F7F9FD] pl-10 pr-3 text-sm text-[#102B5C] outline-none transition focus:border-[#3D72D1] focus:bg-white"
                    />
                </label>

                <select
                    value={draftFilters.status}
                    onChange={(event) =>
                        setDraftFilters({
                            ...draftFilters,
                            status: event.target.value,
                        })
                    }
                    className="h-11 rounded-2xl border border-[#DCE3F2] bg-[#F7F9FD] px-3 text-sm text-[#102B5C] outline-none transition focus:border-[#3D72D1] focus:bg-white"
                >
                    <option value="">All statuses</option>
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                        </option>
                    ))}
                </select>

                <select
                    value={draftFilters.position_id}
                    onChange={(event) =>
                        setDraftFilters({
                            ...draftFilters,
                            position_id: event.target.value,
                        })
                    }
                    className="h-11 rounded-2xl border border-[#DCE3F2] bg-[#F7F9FD] px-3 text-sm text-[#102B5C] outline-none transition focus:border-[#3D72D1] focus:bg-white"
                >
                    <option value="">All positions</option>
                    {positions.map((position) => (
                        <option key={position.id} value={position.id}>
                            {position.title}
                        </option>
                    ))}
                </select>

                <select
                    value={draftFilters.sort}
                    onChange={(event) =>
                        setDraftFilters({
                            ...draftFilters,
                            sort: event.target.value as AdminApplicationFilters['sort'],
                        })
                    }
                    className="h-11 rounded-2xl border border-[#DCE3F2] bg-[#F7F9FD] px-3 text-sm text-[#102B5C] outline-none transition focus:border-[#3D72D1] focus:bg-white"
                >
                    {sorts.map((sort) => (
                        <option key={sort} value={sort}>
                            {SORT_LABELS[sort] ?? sort}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onReset}
                        className="rounded-full border border-[#DCE3F2] px-5 py-2 text-sm font-bold text-[#102B5C] transition hover:bg-[#F7F9FD]"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-full bg-[#1D449C] px-5 py-2 text-sm font-bold text-white shadow-[0_10px_24px_rgba(29,68,156,0.25)] transition hover:bg-[#17377E]"
                    >
                        <Filter className="size-4" />
                        Apply
                    </button>
                </div>
            </div>
        </form>
    );
}
