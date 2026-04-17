import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpDown,
    CalendarDays,
    Eye,
    Filter,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { index, show } from '@/routes/applications';
import type {
    AdminApplicationFilters,
    AdminApplicationListItem,
    AdminApplicationStatus,
    Paginated,
} from '@/types';

type PositionOption = {
    id: number;
    title: string;
};

type Props = {
    applications: Paginated<AdminApplicationListItem>;
    filters: AdminApplicationFilters;
    options: {
        statuses: AdminApplicationStatus[];
        positions: PositionOption[];
        sorts: string[];
    };
};

const STATUS_LABELS: Record<AdminApplicationStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    submitted: 'Submitted',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
};

const SORT_LABELS: Record<string, string> = {
    created_at_desc: 'Applied newest',
    created_at_asc: 'Applied oldest',
    submitted_at_desc: 'Submitted newest',
    candidate_name_asc: 'Candidate A-Z',
    position_title_asc: 'Position A-Z',
    total_score_desc: 'Top auto score',
};

const STATUS_CLASSES: Record<AdminApplicationStatus, string> = {
    pending: 'bg-slate-100 text-slate-600',
    in_progress: 'bg-blue-50 text-blue-700',
    submitted: 'bg-amber-50 text-amber-700',
    under_review: 'bg-indigo-50 text-indigo-700',
    approved: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-rose-50 text-rose-700',
};

function cleanQuery(filters: AdminApplicationFilters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ''),
    );
}

function formatDate(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Prev')
        .replace('Next &raquo;', 'Next');
}

export default function ApplicationsIndex({
    applications,
    filters,
    options,
}: Props) {
    const [draftFilters, setDraftFilters] =
        useState<AdminApplicationFilters>(filters);

    const applyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.get(
            index.url({ query: cleanQuery(draftFilters) }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const resetFilters = () => {
        const nextFilters: AdminApplicationFilters = {
            search: '',
            status: '',
            position_id: '',
            applied_from: '',
            applied_to: '',
            submitted_from: '',
            submitted_to: '',
            min_score: '',
            max_score: '',
            sort: 'created_at_desc',
        };

        setDraftFilters(nextFilters);
        router.get(index.url(), {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Applications" />

            <div className="min-h-screen p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-5">


                    <form
                        onSubmit={applyFilters}
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
                                {options.statuses.map((status) => (
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
                                {options.positions.map((position) => (
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
                                {options.sorts.map((sort) => (
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
                                    onClick={resetFilters}
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

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px] text-left text-sm">
                                <thead className="bg-[#F7F9FD] text-xs uppercase tracking-[0.14em] text-[#6B7894]">
                                    <tr>
                                        <th className="px-5 py-3">Candidate</th>
                                        <th className="px-5 py-3">Contact</th>
                                        <th className="px-5 py-3">Position</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Auto Score</th>
                                        <th className="px-5 py-3">Applied</th>
                                        <th className="px-5 py-3">Submitted</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EDF1F8]">
                                    {applications.data.map((application) => (
                                        <tr
                                            key={application.id}
                                            className="transition hover:bg-[#F9FBFF]"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-bold text-[#102B5C]">
                                                    {application.candidate_name ?? '-'}
                                                </p>
                                                {application.reviewer_name && (
                                                    <p className="mt-1 text-xs text-[#6B7894]">
                                                        Reviewed by {application.reviewer_name}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-[#102B5C]">
                                                    {application.email ?? '-'}
                                                </p>
                                                <p className="text-xs text-[#6B7894]">
                                                    {application.phone ?? '-'}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-[#102B5C]">
                                                {application.position_title ?? '-'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASSES[application.status]}`}
                                                >
                                                    {STATUS_LABELS[application.status]}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-2xl font-black text-[#1D449C]">
                                                    {application.total_score ?? '-'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-[#526078]">
                                                <span className="inline-flex items-center gap-2">
                                                    <CalendarDays className="size-4" />
                                                    {formatDate(application.created_at)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-[#526078]">
                                                {formatDate(application.submitted_at)}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    href={show.url(application.id, {
                                                        query: cleanQuery(filters),
                                                    })}
                                                    className="inline-flex items-center gap-2 rounded-full bg-[#102B5C] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1D449C]"
                                                >
                                                    <Eye className="size-4" />
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {applications.data.length === 0 && (
                            <div className="px-5 py-16 text-center">
                                <p className="text-lg font-bold text-[#102B5C]">
                                    No applications found
                                </p>
                                <p className="mt-2 text-sm text-[#6B7894]">
                                    Adjust the filters or reset the search query.
                                </p>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E7ECF6] px-5 py-4">
                            <p className="text-sm text-[#6B7894]">
                                Page {applications.current_page} of {applications.last_page}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {applications.links.map((link, index) => (
                                    <Link
                                        key={`${link.label}-${index}`}
                                        href={link.url ?? '#'}
                                        className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${link.active
                                            ? 'bg-[#1D449C] text-white'
                                            : link.url
                                                ? 'bg-[#F0F5FF] text-[#1D449C] hover:bg-[#DCE8FF]'
                                                : 'pointer-events-none bg-[#F3F5F9] text-[#A0A9BA]'
                                            }`}
                                        preserveScroll
                                    >
                                        {paginationLabel(link.label)}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
