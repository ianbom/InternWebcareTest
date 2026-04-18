import { Link } from '@inertiajs/react';
import { CalendarDays, Eye } from 'lucide-react';
import { cleanQuery, formatDate } from '@/pages/shared/utils';
import { show } from '@/routes/applications';
import type { AdminApplicationFilters, AdminApplicationListItem } from '@/types';
import { ScoreBadge } from './ScoreBadge';
import { StatusBadge } from './StatusBadge';

type ApplicationsTableProps = {
    applications: AdminApplicationListItem[];
    filters: AdminApplicationFilters;
};

export function ApplicationsTable({
    applications,
    filters,
}: ApplicationsTableProps) {
    return (
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
                    {applications.map((application) => (
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
                                <StatusBadge status={application.status} />
                            </td>
                            <td className="px-5 py-4">
                                <ScoreBadge score={application.total_score} />
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
    );
}
