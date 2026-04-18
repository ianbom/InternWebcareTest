import { Link } from '@inertiajs/react';
import { paginationLabel } from '@/pages/shared/utils';
import type { Paginated } from '@/types';

type ApplicationsPaginationProps = {
    applications: Pick<Paginated<unknown>, 'current_page' | 'last_page' | 'links'>;
};

export function ApplicationsPagination({
    applications,
}: ApplicationsPaginationProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E7ECF6] px-5 py-4">
            <p className="text-sm text-[#6B7894]">
                Page {applications.current_page} of {applications.last_page}
            </p>
            <div className="flex flex-wrap gap-2">
                {applications.links.map((link, index) => (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url ?? '#'}
                        className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
                            link.active
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
    );
}
