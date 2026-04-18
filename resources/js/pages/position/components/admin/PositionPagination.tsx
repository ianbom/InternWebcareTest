import { Link } from '@inertiajs/react';
import { ArrowUpDown } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import type { Paginated, PositionListItem } from '@/types';
import { paginationLabel } from '../../utils/position-format';

interface PositionPaginationProps {
    positions: Paginated<PositionListItem>;
    selectedSort: string;
}

export function PositionPagination({
    positions,
    selectedSort,
}: PositionPaginationProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[#6B7894]">
                    Menampilkan {positions.from ?? 0}-{positions.to ?? 0} dari{' '}
                    {positions.total} position
                </p>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F5FF] px-3 py-1.5 text-xs font-bold text-[#1D449C]">
                    <ArrowUpDown className="size-3.5" />
                    {selectedSort}
                </div>
            </div>

            <Pagination className="justify-end">
                <PaginationContent className="flex-wrap">
                    {positions.links.map((link, index) => (
                        <PaginationItem key={`${link.label}-${index}`}>
                            <Link
                                href={link.url ?? '#'}
                                preserveScroll
                                className={cn(
                                    buttonVariants({
                                        variant: link.active
                                            ? 'default'
                                            : 'outline',
                                        size: 'sm',
                                    }),
                                    'rounded-full',
                                    !link.url && 'pointer-events-none opacity-45',
                                )}
                            >
                                {paginationLabel(link.label)}
                            </Link>
                        </PaginationItem>
                    ))}
                </PaginationContent>
            </Pagination>
        </div>
    );
}
